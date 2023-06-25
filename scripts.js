//------------ VARIÁVEIS GLOBAIS - INÍCIO-----------------
const ctx = document.getElementById('myChart'); //Cria o objeto ctx.
const graficoDispersao = new Chart(ctx, { type: 'scatter', }); //Cria o Chart do Tipo Scatter (Dispersão)

const sliderAngulo = document.getElementById("myRangeAngulo"); //Pega o botão slider do Ângulo
const sliderSpeed = document.getElementById("myRangeSpeed"); //Pega o botão slider da Velocidade inicial
const sliderGravidade = document.getElementById("myRangeGravidade"); //Pega o botão slider da Gravidade
const sliderAlturaIni = document.getElementById("myRangeAlturaIni"); //Pega o botão slider da Altura inicial

const inputAngulo = document.getElementById("text_Ang_Lan"); //Pega o texto do Ângulo
const inputSpeed = document.getElementById("text_Vel_Ini"); //Pega o texto da Velocidade inicial
const inputGravidade = document.getElementById("text_Grav"); //Pega o texto da Gravidade
const inputAlturaIni = document.getElementById("text_Alt_Ini"); //Pega o texto da Altura inicial
//------------ VARIÁVEIS GLOBAIS - FINAL-----------------

//------------ LISTENERS DOS INPUTS - INÍCIO-----------------
inputAngulo.addEventListener('input', () => {
  funcaoPrincipal(); //Ao alterar o texto será executada a função funcaoPrincipalr
  sliderAngulo.value = inputAngulo.value; //Atualiza a posição do slider de acordo com o valor do texto
});
inputSpeed.addEventListener('input', () => {
  funcaoPrincipal(); //Ao alterar o texto será executada a função funcaoPrincipalr
  sliderSpeed.value = inputSpeed.value; //Atualiza a posição do slider de acordo com o valor do texto
});
inputGravidade.addEventListener('input', () => {
  if (validaGravidade(Number(inputGravidade.value)) === true) {
    funcaoPrincipal(); //Ao alterar o texto será executada a função funcaoPrincipalr
    sliderGravidade.value = inputGravidade.value; //Atualiza a posição do slider de acordo com o valor do texto
  };
});
inputAlturaIni.addEventListener('input', () => {
  funcaoPrincipal(); //Ao alterar o texto será executada a função funcaoPrincipalr
  sliderAlturaIni.value = inputAlturaIni.value; //Atualiza a posição do slider de acordo com o valor do texto
});
//------------ LISTENERS DOS INPUTS - FINAL-----------------

//------------ SLIDE BUTTONS - INÍCIO -----------------
sliderAngulo.oninput = function () {
  inputAngulo.value = this.value; //Atualiza o Texto de acordo com o Slider
  funcaoPrincipal(); //Ao alterar o slider será executada a função funcaoPrincipal
};
sliderSpeed.oninput = function () {
  inputSpeed.value = this.value; //Atualiza o Texto de acordo com o Slider
  funcaoPrincipal(); //Ao alterar o slider será executada a função funcaoPrincipal
};
sliderGravidade.oninput = function () {
  inputGravidade.value = this.value; //Atualiza o Texto de acordo com o Slider
  funcaoPrincipal(); //Ao alterar o slider será executada a função funcaoPrincipal
};
sliderAlturaIni.oninput = function () {
  inputAlturaIni.value = this.value; //Atualiza o Texto de acordo com o Slider
  funcaoPrincipal(); //Ao alterar o slider será executada a função funcaoPrincipal
};
//------------ SLIDE BUTTONS - FINAL -----------------

funcaoPrincipal();// Roda o primeiro cálculo para apresentar o gráfico com os valores iniciais.

//------------- FUNÇÃO PARA CALCULAR A TRAJETÓRIA -------------------
function funcaoPrincipal() {
  //-------------ENTRADA DE DADOS - INÍCIO---------------
  let velocidadeInicial = Number(inputSpeed.value); //get valor da velocidade inicial em m/s
  let anguloLancamentoGraus = Number(inputAngulo.value); //get valor do ângulo de lançamento em graus
  let gravidade = Number(inputGravidade.value); //get valor da gravidade em m/s²
  let alturaInicial = Number(inputAlturaIni.value); //get valor da altura inicial em "metros"
  //-------------ENTRADA DE DADOS - FINAL--------------

  //-------------Obtém os dados da função calculos-----------
  let [vetorDist, vetorAltura, alcance, alturaTotal] = calculos(velocidadeInicial, anguloLancamentoGraus, gravidade, alturaInicial);

  // Gera o gráfico.
  geraGrafico(vetorDist, vetorAltura, alcance, alturaTotal);

};
//------------- FUNÇÃO PARA FAZER OS CÁLCULOS DA TRAJETÓRIA (Chamada pela Função funcaoPrincipal()) -------------------
function calculos(velocidadeInicial, anguloLancamentoGraus, gravidade, alturaInicial) {
  //-------------CÁLCULOS - INÍCIO-------------
  const txtVelX = document.getElementById("text_Vx"); //get caixa de texto de saída da velocidade inicial em X
  const txtVelY = document.getElementById("text_Vy"); //get caixa de texto de saída da velocidade inicial em Y 
  const txtAlcance = document.getElementById("text_Alcance"); //get caixa de texto de saída do Alcance máximo
  const txtAltura = document.getElementById("text_Altura"); //get caixa de texto de saída Altura máxima
  const txtTempoTotal = document.getElementById("text_Tempo_Total"); //get caixa de texto de saída do tempo total
  const txtVelFinal = document.getElementById("text_Vel_Final"); //get caixa de texto de saída da velocidade final
  let anguloLancamentoRadianos = anguloLancamentoGraus * Math.PI / 180; //transforma ângulo em graus para radianos
  let v0x = velocidadeInicial * Math.cos(anguloLancamentoRadianos); //Velocidade inicial em X
  let v0y = velocidadeInicial * Math.sin(anguloLancamentoRadianos); //Velocidade inical em Y
  let tempoParcial = Math.abs(v0y / gravidade); //Tempo parcial. Tempo que a partícula leva para subir e descer sem considerar a Altura inicial
  let velParcial = v0y + gravidade * tempoParcial * 2; //Velocidade Parcial em Y. Velocidade com que a particula atinge o nível de lançamento. (Poderia ser a mesma velocidade inicial em Y, porém, decidi fazer assim, caso eu implemente a resistência do ar)
  let alturaMaxParcial = (v0y * v0y) / Math.abs(gravidade) / 2; //Altura máxima parcial. Altura máxima que atinge sem considerar a Altura inicial.
  let velFinal = Math.sqrt(velParcial * velParcial + 2 * gravidade * -alturaInicial) * (-1); //Velocidade final em Y. Considera a velocidade final com a Altura inicial
  let tempoRestante = (velFinal - velParcial) / gravidade; //Tempo que resta para a partícula atingir o nível 0 em relação a altura inicial
  let tempoTotal = tempoParcial * 2 + tempoRestante; // Tempo Total. Tempo Parcial + Tempo Restante
  let alcance = v0x * tempoTotal; //Alcance máximo em X que a partícula atinge.
  let alturaTotal = alturaInicial + alturaMaxParcial; //Altura total considerando a altura inicial.

  let vetorTempo = []; //Vetor Intervalo de tempo
  let vetorVel = []; //Vetor Velocidades
  let vetorDist = []; //Vetor Distâncias
  let vetorAltura = []; //Vetor Alturas

  //Preenchendo os vetores
  vetorTempo[0] = 0; //Iniciando tempo
  vetorVel[0] = v0y; //Iniciando Velocidade em y
  vetorDist[0] = 0; //Iniciando distância
  vetorAltura[0] = alturaInicial; //Iniciando altura
  let intervalo = 109; // Número que divide o tempo para cálculos parciais

  for (let i = 1; i <= intervalo; i++) {
    vetorTempo[i] = (tempoTotal / intervalo + vetorTempo[i - 1])
    vetorVel[i] = (v0y + gravidade * vetorTempo[i]);
    vetorDist[i] = (v0x * vetorTempo[i]);
    vetorAltura[i] = (alturaInicial + (v0y * vetorTempo[i] + gravidade / 2 * vetorTempo[i] * vetorTempo[i]));
  }
  //-------------CÁLCULOS - FINAL-------------
  //-------------RESULTADO - INÍCIO---------------
  let arredondamento = 2;
  txtVelX.value = v0x.toFixed(arredondamento); //Apresenta a Velocidade X
  txtVelY.value = v0y.toFixed(arredondamento); //Apresenta a Velocidade Y
  txtAlcance.value = alcance.toFixed(arredondamento); //Apresenta o Alcance máximo
  txtAltura.value = alturaTotal.toFixed(arredondamento); //Apresenta a Altura máxima
  txtTempoTotal.value = tempoTotal.toFixed(arredondamento); //Apresenta Tempo total
  txtVelFinal.value = velFinal.toFixed(arredondamento); //Apresenta a Velocidade final em Y
  //-------------RESULTADO - FINAL---------------
  return [vetorDist, vetorAltura, alcance, alturaTotal, intervalo];
};

//------------- FUNÇÃO PARA GERAR O GRÁFICO (Chamada pela Função funcaoPrincipal()) -------------------
function geraGrafico(vetorDist, vetorAltura, alcance, altura) {

  let xyCoordinates = vetorDist.map((x, index) => ({ x: x, y: vetorAltura[index] })); //Cria o array de objetos x, y necessário para a Série 1 do Chart
  let vetorResultado = teto(alcance, altura); // Retorna os máximos de X e Y do Chart
  let checkedValue = document.getElementById('chk_Trava_Tela').checked //Pega status do checkbox de travar as dimensões do gráfico

  graficoDispersao.options.animation = false; // Desabilita animações
  graficoDispersao.options.animations.colors = false; // Desabilita animações definidas pela propriedade de coleção de cores.
  graficoDispersao.options.animations.x = false; // Desabilita animações definidas pela propriedade do eixo X
  graficoDispersao.options.transitions.active.animation.duration = 0; // Desabilita animações de modo ativo
  graficoDispersao.options.scales.x.min = 0; //Mínimo do gráfico em X
  graficoDispersao.options.scales.y.min = 0; //Mínimo do gráfico em Y
  if (checkedValue === false) { //Faz a verificação de travamento das dimensões do gráfico
    graficoDispersao.options.scales.x.max = vetorResultado[0]; //Máximo do gráfico em X
    graficoDispersao.options.scales.y.max = vetorResultado[1]; //Máximo do gráfico em Y
  };

  //Cria objeto com as propriedades de dados necessários para criar o Chart
  let dados = {
    datasets: [{ //Série 1
      label: 'Trajetória', //Nome da série
      borderWidth: 1, //Espessura da linha
      showLine: true, //Mostra a linha
      data: xyCoordinates, //Dados da Série
      borderColor: 'rgba(0, 200, 0, 1)', //Cor da linha
      pointRadius: 0, //Tamanho do raio dos pontos (Zero tira os pontos)
      borderDash: [5, 5], //Estilo da linha
    },
    { //Série 2 (Projétil)
      label: 'Projétil', //Nome da Série
      borderColor: 'rgba(200, 0, 0, 1)', //Cor da Série
      pointRadius: 5,
    },
    ]
  };
  graficoDispersao.data = dados; //Atribui o objeto dados à propriedade data
  graficoDispersao.update(); //Atualiza o Chart
};

//------------- FUNÇÃO PARA FAZER A ANIMAÇÃO DO PROJÉTIL (Chamada pela Função geraGrafico())-------------------
function geraAnimacao(vetorDist, vetorAltura, intervalo) {
  let i = 0; //Contador de tempo para verificar o final do loop
  let tempo = 20; //Tempo de animação
  let animacao = setInterval(rodaAnimacao, tempo); //Determina a função setInterval
  function rodaAnimacao() { //Função que roda a animação
    graficoDispersao.data.datasets[1].data = [{ x: Number(vetorDist[i]), y: Number(vetorAltura[i]) }]; //Atualiza as coordenadas x,y do ponto
    i = i + 1; //Contador
    if (i == (intervalo + 1)) { //Verifica se já chegou ao fim
      clearInterval(animacao); //Se chegou cancela a animação.
    };
    graficoDispersao.update();//atualiza o Gráfico.
  }
};

//------------- FUNÇÃO PARA GERAR OS LIMITES MÁXIMOS DO GRÁFICO (Chamada pela Função geraGrafico())-------------------
function teto(alcance, altura) {
  let vetorResultado = []; //Cria vetor para guardar o X Máximo e o Y máximo
  let divisor = 1; //Inicia a Precisão
  //teto alcance - Posição 0 do vetorResultado
  if (alcance < 100) {
    divisor = 1; //Determinei a precisão para um alcance menor que 100 de 1 unidade.
    vetorResultado[0] = (alcance - alcance % divisor) + divisor;
  } else if (alcance < 1000) {
    divisor = 10; //Menor que 1000 a precisão é de 10 unidades
    vetorResultado[0] = (alcance - alcance % divisor) + divisor;
  } else {
    divisor = 100; //Acima de 1000 a precisão é de 100 unidades
    vetorResultado[0] = (alcance - alcance % divisor) + divisor;
  };
  //teto altura - Posição 1 do vetorResultado
  if (altura < 100) {
    divisor = 1; //Determinei a precisão para uma Altura menor que 100 de 1 unidade.
    vetorResultado[1] = (altura - altura % divisor) + divisor;
  } else if (altura < 1000) {
    divisor = 10; //Menor que 1000 a precisão é de 10 unidades
    vetorResultado[1] = (altura - altura % divisor) + divisor;
  } else {
    divisor = 100; //Acima de 1000 a precisão é de 100 unidades
    vetorResultado[1] = (altura - altura % divisor) + divisor;
  };
  return vetorResultado; //Devolve vetorResultado
}

//------------- FUNÇÃO PARA DISPARAR UM PROJÉTIL (Chamada pela Função geraAnimacao())-------------------
function dispara() {
  //-------------ENTRADA DE DADOS - INÍCIO---------------
  let velocidadeInicial = Number(inputSpeed.value); //get valor da velocidade inicial em m/s
  let anguloLancamentoGraus = Number(inputAngulo.value); //get valor do ângulo de lançamento em graus
  let gravidade = Number(inputGravidade.value); //get valor da gravidade em m/s²
  let alturaInicial = Number(inputAlturaIni.value); //get valor da altura inicial em "metros"
  //-------------ENTRADA DE DADOS - FINAL--------------

  //-------------Obtém os dados da função calculos-----------
  let [vetorDist, vetorAltura, alcance, alturaTotal, intervalo] = calculos(velocidadeInicial, anguloLancamentoGraus, gravidade, alturaInicial);

  // Gera animação
  geraAnimacao(vetorDist, vetorAltura, intervalo);
};

//------------- FUNÇÃO PARA VALIDAR O INPUT GRAVIDADE (Chamada pela Função sliderGravidade.oninput)-------------------
function validaGravidade(valor) {
  if (typeof (valor) !== 'number') { //Verifica se é um número
    return false; // Se não for retorna falso
  } else { // Se for trata
    if (valor > 0) { //Se o valor for maior que zero
      inputGravidade.value = valor * (-1); //Multiplica por -1 (Forçar que o valor seja sempre negativo)
      return true;
    }
    return true;
  };

};
