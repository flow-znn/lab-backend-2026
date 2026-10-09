import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, Navigate, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { api } from "./api";
import { useAuth } from "./auth";
import type { Ticket, TicketStatus } from "./types";

const statusLabels: Record<TicketStatus, string> = { OPEN: "Aberto", IN_PROGRESS: "Em andamento", RESOLVED: "Concluído" };

function Loading() { return <div className="loading">Carregando…</div>; }
function ErrorBox({ children }: { children: ReactNode }) { return <div className="alert error" role="alert">{children}</div>; }
function Status({ value }: { value: TicketStatus }) { return <span className={`status status-${value.toLowerCase()}`}>{statusLabels[value]}</span>; }

function Login() {
  const { login, user } = useAuth(); const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/app" replace />;
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setBusy(true);
    try { await login(email, password); navigate("/app", { replace: true }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível entrar."); }
    finally { setBusy(false); }
  }
  return <main className="auth-page"><section className="auth-panel"><Brand /><span className="eyebrow">CENTRAL DE SUPORTE</span><h1>Acesse sua conta</h1><p className="muted">Entre com as credenciais cadastradas no servidor.</p><form onSubmit={submit}>
    {error && <ErrorBox>{error}</ErrorBox>}
    <label>E-mail<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@empresa.com" /></label>
    <label>Senha<input type="password" autoComplete="current-password" minLength={6} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Sua senha" /></label>
    <button disabled={busy}>{busy ? "Entrando…" : "Entrar"}</button>
  </form><p className="footnote">O acesso é validado pela autenticação do servidor.</p></section></main>;
}

function Brand() { return <Link className="brand" to="/app"><span className="brand-icon">A</span> Atende<span className="green">.</span></Link>; }

function Shell() {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  function signOut() { logout(); navigate("/login", { replace: true }); }
  return <div className="app-shell"><aside className="sidebar"><Brand /><span className="eyebrow">HELPDESK</span><nav>
    <NavLink end to="/app">Visão geral</NavLink><NavLink to="/app/chamados">Chamados</NavLink><NavLink to="/app/chamados/novo">Abrir chamado</NavLink>
  </nav><div className="side-user"><strong>{user?.username}</strong><span>{user?.email}</span><button className="secondary" onClick={signOut}>Sair</button></div></aside><main className="main-area"><header><div className="mobile-brand"><Brand /></div><span>Central de suporte</span></header><div className="content"><Routes><Route index element={<Dashboard />} /><Route path="chamados" element={<TicketList />} /><Route path="chamados/novo" element={<NewTicket />} /><Route path="chamados/:id" element={<TicketDetail />} /><Route path="*" element={<Navigate to="/app" replace />} /></Routes></div></main></div>;
}

function PageHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) { return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div>{children}</div>; }

function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  async function refresh() { setLoading(true); setError(""); try { setTickets(await api.tickets()); } catch (e) { setError(e instanceof Error ? e.message : "Falha ao carregar chamados."); } finally { setLoading(false); } }
  useEffect(() => { void refresh(); }, []);
  const stats = [
    ["Total", tickets.length], ["Abertos", tickets.filter(t => t.status === "OPEN").length],
    ["Em andamento", tickets.filter(t => t.status === "IN_PROGRESS").length], ["Concluídos", tickets.filter(t => t.status === "RESOLVED").length],
  ];
  return <><PageHeading eyebrow="SEU ESPAÇO" title="Visão geral"><Link className="button" to="/app/chamados/novo">＋ Abrir chamado</Link></PageHeading>
    {error && <div className="alert error alert-action">{error}<button className="link-button" onClick={() => void refresh()}>Tentar novamente</button></div>}
    <section className="stats-grid">{stats.map(([label, value]) => <article className="stat-card" key={label}><span>{label}</span><strong>{loading || error ? "—" : value}</strong></article>)}</section>
    <section className="panel"><div className="panel-heading"><div><h2>Chamados recentes</h2><p>Solicitações vinculadas à sua conta</p></div><Link to="/app/chamados">Ver todos →</Link></div>
      {loading ? <Loading /> : error ? null : tickets.length ? <TicketTable tickets={tickets.slice(0, 5)} /> : <Empty text="Você ainda não abriu chamados." action={<Link className="button secondary" to="/app/chamados/novo">Abrir primeiro chamado</Link>} />}
    </section>
  </>;
}

function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  async function refresh() { setLoading(true); setError(""); try { setTickets(await api.tickets()); } catch (e) { setError(e instanceof Error ? e.message : "Falha ao carregar chamados."); } finally { setLoading(false); } }
  useEffect(() => { void refresh(); }, []);
  return <><PageHeading eyebrow="ACOMPANHAMENTO" title="Chamados"><Link className="button" to="/app/chamados/novo">＋ Abrir chamado</Link></PageHeading><section className="panel"><div className="panel-heading"><div><h2>Seus chamados</h2><p>{loading ? "Atualizando…" : `${tickets.length} ${tickets.length === 1 ? "chamado" : "chamados"}`}</p></div><button className="secondary" onClick={() => void refresh()} disabled={loading}>Atualizar</button></div>
    {loading ? <Loading /> : error ? <div className="panel-body"><ErrorBox>{error}</ErrorBox><button className="secondary" onClick={() => void refresh()}>Tentar novamente</button></div> : tickets.length ? <TicketTable tickets={tickets} /> : <Empty text="Quando você abrir um chamado, ele aparecerá aqui." action={<Link className="button secondary" to="/app/chamados/novo">Criar chamado</Link>} />}
  </section></>;
}

function TicketTable({ tickets }: { tickets: Ticket[] }) { return <div className="table-wrap"><table><thead><tr><th>CHAMADO</th><th>ABERTO EM</th><th>STATUS</th></tr></thead><tbody>{tickets.map(ticket => <tr key={ticket.id}><td><Link className="ticket-link" to={`/app/chamados/${ticket.id}`}>{ticket.title}</Link><span className="preview">{ticket.description}</span></td><td>{new Date(ticket.createdAt).toLocaleDateString("pt-BR")}</td><td><Status value={ticket.status} /></td></tr>)}</tbody></table></div>; }

function Empty({ text, action }: { text: string; action: ReactNode }) { return <div className="empty-state"><div className="empty-icon">▤</div><h3>Nenhum chamado</h3><p>{text}</p>{action}</div>; }

function NewTicket() {
  const navigate = useNavigate(); const [title, setTitle] = useState(""); const [description, setDescription] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const [saved, setSaved] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); setError(""); try { const ticket = await api.createTicket(title, description); setSaved(true); navigate(`/app/chamados/${ticket.id}`, { replace: true }); } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível abrir o chamado."); } finally { setBusy(false); } }
  return <><PageHeading eyebrow="NOVA SOLICITAÇÃO" title="Abrir chamado"><Link className="button secondary" to="/app/chamados">Voltar</Link></PageHeading><section className="panel form-panel"><div className="panel-heading"><div><h2>Descreva sua solicitação</h2><p>Informe os detalhes para a equipe de suporte.</p></div></div><form onSubmit={submit}>
    {error && <ErrorBox>{error}</ErrorBox>}{saved && <div className="alert success">Chamado criado.</div>}
    <label>Título<input required minLength={3} maxLength={160} value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex.: Não consigo acessar o sistema" /></label>
    <label>Descrição<textarea required minLength={5} maxLength={10000} rows={7} value={description} onChange={e => setDescription(e.target.value)} placeholder="Conte o que aconteceu e o que você já tentou." /></label>
    <div className="form-actions"><span>O status inicial será Aberto.</span><button disabled={busy}>{busy ? "Enviando…" : "Enviar chamado"}</button></div>
  </form></section></>;
}

function TicketDetail() {
  const { id = "" } = useParams(); const { user } = useAuth(); const [ticket, setTicket] = useState<Ticket | null>(null); const [error, setError] = useState(""); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false);
  async function refresh() { setLoading(true); setError(""); try { setTicket(await api.ticket(id)); } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível carregar o chamado."); } finally { setLoading(false); } }
  useEffect(() => { void refresh(); }, [id]);
  async function updateStatus(status: TicketStatus) { if (!ticket) return; setBusy(true); setError(""); try { setTicket(await api.updateTicketStatus(ticket.id, status)); } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível atualizar o status."); } finally { setBusy(false); } }
  if (loading) return <Loading />;
  if (error && !ticket) return <><PageHeading eyebrow="DETALHES" title="Chamado"><Link className="button secondary" to="/app/chamados">Voltar</Link></PageHeading><ErrorBox>{error}</ErrorBox></>;
  if (!ticket) return null;
  const isAdmin = user?.roles.includes("ADMIN") ?? false;
  return <><PageHeading eyebrow="DETALHES DO CHAMADO" title={ticket.title}><Link className="button secondary" to="/app/chamados">Todos os chamados</Link></PageHeading>{error && <ErrorBox>{error}</ErrorBox>}<section className="panel detail-panel"><div className="detail-top"><div><span className="eyebrow">STATUS</span><p><Status value={ticket.status} /></p></div>{isAdmin && <label className="status-select">Alterar status<select value={ticket.status} disabled={busy} onChange={e => void updateStatus(e.target.value as TicketStatus)}><option value="OPEN">Aberto</option><option value="IN_PROGRESS">Em andamento</option><option value="RESOLVED">Concluído</option></select></label>}</div><div className="detail-description"><h2>Descrição</h2><p>{ticket.description}</p></div><div className="detail-meta"><div><span>Solicitante</span><strong>{ticket.owner.name}</strong></div><div><span>Criado em</span><strong>{new Date(ticket.createdAt).toLocaleString("pt-BR")}</strong></div><div><span>Última atualização</span><strong>{new Date(ticket.updatedAt).toLocaleString("pt-BR")}</strong></div></div></section></>;
}

export default function App() {
  const { loading, user } = useAuth();
  if (loading) return <div className="center">Validando sua sessão…</div>;
  return <Routes><Route path="/login" element={<Login />} /><Route path="/app/*" element={user ? <Shell /> : <Navigate to="/login" replace />} /><Route path="*" element={<Navigate to={user ? "/app" : "/login"} replace />} /></Routes>;
}
