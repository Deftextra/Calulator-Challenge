define(["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //If we need run time control of variables put them in viewModel. 
    var Calculator;
    (function (Calculator) {
        //Lexer: 
        function lexer(Calculation) {
            var tokens = [];
            var tokenRegEx = /\s*([A-Za-z]+|[0-9]+|\S)\s*/g;
            var m;
            while ((m = tokenRegEx.exec(Calculation)) !== null) {
                tokens.push(m[1]);
            }
            return tokens;
        }
        //Test function: 
        function isNumber(token) {
            return (token !== undefined) && (token.match(/^[0-9]$/)) !== null;
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
                    throw "Only consume tokens at current position";
                }
                position++;
            }
            //Grammer
            function parsePrime() {
                var t = see();
                if (isNumber(t)) {
                    consume(t);
                    return { type: "number", value: t };
                }
                else if (t === "(") {
                    consume(t);
                    var expr = parseExpr();
                    if (see() !== ")") {
                        alert("expected )");
                        //needs to display error in results
                        throw new SyntaxError("expected )");
                    }
                    consume(")");
                    return expr;
                }
                else {
                    //needs to display error in results
                    throw new SyntaxError("Error: All characters must be a number or parenthese");
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
                //needs to display error in results 
                throw new SyntaxError("Wrong chracters:'" + see() + "'");
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
                return 0;
            }
        }
        Calculator.treeValue = treeValue;
        var ViewModel = /** @class */ (function () {
            function ViewModel() {
                this.inputExpression = ko.observable("");
                this.outputResult = ko.observable("");
            }
            ViewModel.prototype.calculate = function () {
                var inputCalc = this.inputExpression();
            };
            return ViewModel;
        }());
        Calculator.ViewModel = ViewModel;
    })(Calculator || (Calculator = {}));
    var ViewModelIn = new Calculator.ViewModel();
    var parseTree = Calculator.parse("(2 + 3)* dfdsf3 3 ");
    console.log(Calculator.treeValue(parseTree));
});
//# sourceMappingURL=hello.js.map