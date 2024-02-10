export const toLowerBase = (string: string) =>
  string
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('el');

export const studentEmailRegex = /(dai((1[6-9][0-3][0-9][0-9])|(20[0-3][0-9][0-9]))|(it(0|1|9)[0-9][0-9][0-9]?[0-9]?)|(tm(1)[0-4][0-9][0-9]?)|(ics(2)[0-9][0-3][0-9][0-9])|iis(2)[0-9][0-3][0-9][0-9])@uom.edu.gr/