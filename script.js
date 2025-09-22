/**
 * Classe para validar e manipular CPF
 * Explicação para iniciante: CPF tem 11 dígitos. Os últimos 2 são "dígitos verificadores"
 * calculados a partir dos 9 primeiros. A validação verifica formato, repetição e checksum.
 */
class CPF {
  constructor(value) {
    // aceita strings com ou sem máscara (p.ex. "123.456.789-09" ou "12345678909")
    this.raw = String(value || '');
    this.digits = CPF.onlyDigits(this.raw);
  }

  // Retorna apenas dígitos (string)
  static onlyDigits(value) {
    return String(value).replace(/\D+/g, '');
  }

  // Remove máscara e retorna string de 11 dígitos (ou curta se inválida)
  cleaned() {
    return this.digits;
  }

  // Verifica se a sequência é composta por todos os mesmos dígitos (ex: "00000000000")
  static isAllSame(digits) {
    if (!digits) return false;
    return /^([0-9])\1*$/.test(digits);
  }

  // Calcula um dígito verificador (um dos dois últimos)
  // digits: string com dígitos (p.ex. os 9 primeiros)
  // factorStart: número inicial do fator de multiplicação (10 para o primeiro dígito, 11 para o segundo)
  static calculateVerifierDigit(digits, factorStart) {
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      // multiplicador decresce a cada posição
      sum += Number(digits[i]) * (factorStart - i);
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  // Gera os dois dígitos verificadores a partir dos 9 primeiros dígitos
  static calculateCheckDigits(firstNineDigits) {
    const d1 = CPF.calculateVerifierDigit(firstNineDigits, 10);
    const d2 = CPF.calculateVerifierDigit(firstNineDigits + String(d1), 11);
    return String(d1) + String(d2);
  }

  // Validação completa:
  // 1) ter exatamente 11 dígitos
  // 2) não ser sequência repetida como "11111111111"
  // 3) dígitos verificadores corretos
  isValid() {
    const d = this.cleaned();

    // precisa ter 11 dígitos
    if (!d || d.length !== 11) return false;

    // não pode ser todos iguais
    if (CPF.isAllSame(d)) return false;

    const firstNine = d.slice(0, 9);
    const givenCheck = d.slice(9); // últimos dois dígitos

    const expectedCheck = CPF.calculateCheckDigits(firstNine);
    return givenCheck === expectedCheck;
  }

  // Formata o CPF como "000.000.000-00"
  format() {
    const d = this.cleaned();
    if (d.length !== 11) return this.raw; // se inválido comprimento, retorna original
    return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9,11)}`;
  }

  // retorna booleano se está formatado apropriadamente (opcional)
  isFormatted() {
    return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(this.raw);
  }
}

/* =========================
   Exemplos de uso / Testes
   ========================= */

// Exemplos (alguns CPFs de exemplo para testes)
// Observação: use CPFs reais apenas se for autorizado — aqui são apenas exemplos/teste.
const exemplos = [
  '111.444.777-35', // exemplo conhecido e válido
  '12345678909',    // outro exemplo (inválido na maioria dos casos)
  '00000000000',    // inválido (todos iguais)
  '529.982.247-25', // exemplo válido (com máscara)
  '52998224725',    // mesmo acima sem máscara
  '11122233396'     // hipotético (verificar via função)
];

for (const e of exemplos) {
  const cpf = new CPF(e);
  console.log(`Input: ${e} -> Digitos: ${cpf.cleaned()} | Válido: ${cpf.isValid()} | Formatado: ${cpf.format()}`);
}


