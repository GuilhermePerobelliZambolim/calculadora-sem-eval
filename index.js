const copiar = document.getElementById("copyToClipboard");
const igual = document.getElementById("equal");
const limpar = document.getElementById("clear");
const input = document.getElementById("input");
const main = document.querySelector("main");
const root = document.querySelector(":root");
const charKey = document.querySelectorAll(".charKey");
const result = document.getElementById("result");

// Adiciona os valores dos botões ao input
charKey.forEach(function (charKeyBtn) {
  charKeyBtn.addEventListener("click", function () {
    const valor = charKeyBtn.dataset.value.trim();
    input.value += valor;
  });
});

// Limpa os campos da calculadora
limpar.addEventListener("click", function () {
  input.value = "";
  result.value = "";
  result.classList.remove("error", "success");
});

// Realiza o cálculo
igual.addEventListener("click", function () {
  const expressao = input.value.trim();
  const operadorEncontrado = expressao.match(/[+\-*/%]/);

  if (!operadorEncontrado) {
    mostrarErro();
    return;
  }

  const resultado = interpretarExpressao(expressao);

  if (typeof resultado !== "number" || !Number.isFinite(resultado)) {
    mostrarErro();
    return;
  }

  input.value = resultado;
  result.value = "";
  result.classList.remove("error", "success");
});

// Exibe mensagem de erro
function mostrarErro() {
  result.value = "Error!";
  result.classList.remove("success");
  result.classList.add("error");
}

// Interpreta a expressão matemática
function interpretarExpressao(expressao) {
  expressao = expressao.replace(/\s+/g, "");

  // Verifica e calcula o conteúdo entre parênteses
  const inicio = expressao.indexOf("(");
  const fim = expressao.indexOf(")");

  if (inicio !== -1 && fim !== -1) {
    const trecho = expressao.slice(inicio + 1, fim);
    const operador = trecho.match(/[+\-*/%]/)[0];
    const partes = trecho.split(operador);
    const resultado1 = calcular(partes[0], operador, partes[1]);

    const expressaoAtualizada = expressao.replace(
      expressao.slice(inicio, fim + 1),
      resultado1,
    );

    return interpretarExpressao(expressaoAtualizada);
  }

  // Encontra a posição dos operadores
  const posicaoDivisao = expressao.indexOf("/");
  const posicaoMultiplicacao = expressao.indexOf("*");
  const posicaoSoma = expressao.indexOf("+");
  const posicaoSubtracao = expressao.indexOf("-");

  // Resolve primeiro a multiplicação ou divisão
  if (
    posicaoMultiplicacao !== -1 &&
    (posicaoDivisao === -1 || posicaoMultiplicacao < posicaoDivisao)
  ) {
    const trechoEsquerda = expressao.slice(0, posicaoMultiplicacao);
    const trechoDireita = expressao.slice(posicaoMultiplicacao + 1);
    const numeroEsquerda = trechoEsquerda.split(/[+\-*/%]/).pop();
    const numeroDireita = trechoDireita.split(/[+\-*/%]/)[0];

    const resultado = calcular(numeroEsquerda, "*", numeroDireita);

    const expressaoAtualizada = expressao.replace(
      `${numeroEsquerda}*${numeroDireita}`,
      resultado,
    );

    return interpretarExpressao(expressaoAtualizada);

  } else if (posicaoDivisao !== -1) {
    const trechoEsquerda = expressao.slice(0, posicaoDivisao);
    const trechoDireita = expressao.slice(posicaoDivisao + 1);
    const numeroEsquerda = trechoEsquerda.split(/[+\-*/%]/).pop();
    const numeroDireita = trechoDireita.split(/[+\-*/%]/)[0];

    const resultado = calcular(numeroEsquerda, "/", numeroDireita);

    const expressaoAtualizada = expressao.replace(
      `${numeroEsquerda}/${numeroDireita}`,
      resultado,
    );

    return interpretarExpressao(expressaoAtualizada);

  } else if (posicaoSoma !== -1) {
    const partes = expressao.split("+");
    return calcular(partes[0], "+", partes[1]);

  } else if (posicaoSubtracao !== -1) {
    const partes = expressao.split("-");
    return calcular(partes[0], "-", partes[1]);
  }

  // Se não houver operadores, devolve o número
  return Number(expressao);
}

// Realiza as operações matemáticas
function calcular(num1, operador, num2) {
  const n1 = parseFloat(num1.trim());
  const n2 = parseFloat(num2.trim());

  switch (operador) {
    case "+":
      return n1 + n2;

    case "-":
      return n1 - n2;

    case "*":
      return n1 * n2;

    case "/":
      if (n2 === 0) {
        return NaN;
      }
      return n1 / n2;

    case "%":
      return (n1 * n2) / 100;

    default:
      return NaN;
  }
}

// Copia o resultado para a área de transferência
copiar.addEventListener("click", function () {
  const valor = input.value.trim();

  if (valor === "") {
    mostrarErro();
    return;
  }

  navigator.clipboard
    .writeText(valor)
    .then(function () {
      result.value = "Sucesso!";
      result.classList.remove("error");
      result.classList.add("success");
    })
    .catch(function () {
      mostrarErro();
    });

  setTimeout(function () {
    result.value = "";
    result.classList.remove("success", "error");
  }, 2500);
});

// Alterna entre os temas claro e escuro
document.getElementById("thema").addEventListener("click", function () {
  if (main.dataset.theme === "dark") {
    root.style.setProperty("--background", "#0f1117");
    root.style.setProperty("--surface", "#171a23");
    root.style.setProperty("--surface-hover", "#202431");
    root.style.setProperty("--border", "#292e3b");
    root.style.setProperty("--text", "#f8fafc");
    root.style.setProperty("--text-muted", "#94a3b8");
    root.style.setProperty("--primary", "#8b5cf6");
    root.style.setProperty("--primary-hover", "#7c3aed");

    main.dataset.theme = "light";

  } else {
    root.style.setProperty("--background", "#f8f7fc");
    root.style.setProperty("--surface", "#ffffff");
    root.style.setProperty("--surface-hover", "#f1eff8");
    root.style.setProperty("--border", "#ddd8eb");
    root.style.setProperty("--text", "#1f1b2d");
    root.style.setProperty("--text-muted", "#6f6880");
    root.style.setProperty("--primary", "#7c3aed");
    root.style.setProperty("--primary-hover", "#6d28d9");

    main.dataset.theme = "dark";
  }
});
