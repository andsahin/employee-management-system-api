import { Validator } from "node-input-validator";
function validation(rules) {
  return async (req, res, next) => {
    const v = new Validator(req.body, rules);
    v.check().then((matched) => {
      if (!matched) {
        return res.status(500).json({ status: "error", message: v.errors });
      }
      next();
    });
  };
}
export { validation };
