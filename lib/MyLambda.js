//???
var λ = fn = function(func) {
	return Function("_", "_2", "return "+func);
};