export const formatPhone = (value: string) => {
  // Remove tudo que não for número
  const numbers = value.replace(/\D/g, '');

  // Remove o 55 inicial se o usuário digitou ou se já estava lá, para formatar o resto
  const cleanNumbers = numbers.startsWith('55') ? numbers.slice(2) : numbers;

  let formatted = '+55';
  if (cleanNumbers.length > 0) {
    formatted += ` (${cleanNumbers.substring(0, 2)}`;
  }
  if (cleanNumbers.length > 2) {
    formatted += `) ${cleanNumbers.substring(2, 7)}`;
  }
  if (cleanNumbers.length > 7) {
    formatted += `-${cleanNumbers.substring(7, 11)}`;
  }
  return formatted;
};
