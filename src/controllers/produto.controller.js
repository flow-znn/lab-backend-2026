"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoController = void 0;
class ProdutoController {
    produtoService;
    constructor() {
        this.produtoService = new ProdutoService();
    }
    createProduct = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const productData = req.body;
            const product = await this.produtoService.createProduct(productData);
            res.status(201).json(product);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ProdutoController = ProdutoController;
//# sourceMappingURL=produto.controller.js.map