define(["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //If we need run time control of variables put them in viewModel. 
    var Calculator;
    (function (Calculator) {
        //Lexer: 
        function lexer(calculation) {
            var tokens = [];
            var tokenRegEx = /\s*([A-Za-z]+|[0-9]+|\S)\s*/g;
            var m;
            while ((m = tokenRegEx.exec(calculation)) !== null) {
                tokens.push(m[1]);
            }
            return tokens;
        }
        Calculator.lexer = lexer;
        //Test function: 
        function isNumber(token) {
            return (token !== undefined) && (token.match(/^[0-9]+$/)) !== null;
        }
        //Parse function
        function parse(Calculation) {
            var tokens = lexer(Calculation);
            var position = 0;
            function see() {
                return tokens[position];
            }
            function consume(token) {
                if (token !== tokens[position]) {
                    throw new Error("Only consume tokens at current position");
                }
                position++;
            }
            //Gramer Rules. 
            function parsePrime() {
                var t = see();
                if (isNumber(t)) {
                    consume(t);
                    return { type: "number", value: t };
                }
                else if (t === "(") {
                    //Ignore left bracket. 
                    consume(t);
                    //Start new parsing process on expression in closed brackets. 
                    var expr = parseExpr();
                    if (see() !== ")") {
                        throw new SyntaxError("expected ')'");
                    }
                    consume(")");
                    return expr;
                }
                else {
                    if (see() === '+' || see() === '-' || see() === '*' || see() === '/')
                        throw new SyntaxError("' " + see() + "'" + "at wrong position");
                    else {
                        throw new SyntaxError("Token '" + see() + "' not allowed");
                    }
                }
            }
            function parseMul() {
                var expr = parsePrime();
                var t = see();
                while (t === "*" || t === "/") {
                    consume(t);
                    var rhs = parsePrime();
                    expr = { type: t, left: expr, right: rhs };
                    t = see();
                }
                return expr;
            }
            function parseExpr() {
                var expr = parseMul();
                var t = see();
                while (t === "+" || t === "-") {
                    consume(t);
                    var rhs = parseMul();
                    expr = { type: t, left: expr, right: rhs };
                    t = see();
                }
                return expr;
            }
            var result = parseExpr();
            if (position !== tokens.length) {
                throw new SyntaxError("Wrong chracter:'" + see() + "'");
            }
            return result;
        }
        Calculator.parse = parse;
        function treeValue(tree) {
            if (tree.type === '+') {
                return treeValue(tree.left) + treeValue(tree.right);
            }
            else if (tree.type === '-') {
                return treeValue(tree.left) - treeValue(tree.right);
            }
            else if (tree.type === '*') {
                return treeValue(tree.left) * treeValue(tree.right);
            }
            else if (tree.type === '/') {
                return treeValue(tree.left) / treeValue(tree.right);
            }
            else if (tree.type === 'number') {
                return Number(tree.value);
            }
            else {
                return null;
            }
        }
        Calculator.treeValue = treeValue;
        var ViewModel = /** @class */ (function () {
            function ViewModel() {
                this.inputExpression = ko.observable("");
                this.outputResult = ko.observable("");
            }
            ViewModel.prototype.calculate = function () {
                var calcInput = this.inputExpression();
                try {
                    var parseTree = Calculator.parse(calcInput);
                    var value = Calculator.treeValue(parseTree);
                    this.outputResult(String(value));
                }
                catch (e) {
                    this.outputResult(String(e));
                }
            };
            return ViewModel;
        }());
        Calculator.ViewModel = ViewModel;
    })(Calculator || (Calculator = {}));
    var ViewModelIn = new Calculator.ViewModel();
    ko.applyBindings(ViewModelIn);
});
//# sourceMappingURL=hello.js.map