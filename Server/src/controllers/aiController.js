const aiService = require("../Services/aiService");

class AiController {
  async chat(req, res) {
    try {
      const { message } = req.body;

      const result = await aiService.chat(message);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AiController();
