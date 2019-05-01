//seigniorage data

class ZincPrice {
  constructor(year, price, type) {
    this.year = year;
    this.price = price;
  }
}

//line chart data
const zincData = [
  new ZincPrice(1982, .39),
  new ZincPrice(1983, .41),
  new ZincPrice(1984, .49),
  new ZincPrice(1985, .4),
  new ZincPrice(1986, .38),
  new ZincPrice(1987, .42),
  new ZincPrice(1988, .60),
  new ZincPrice(1989, .82),
  new ZincPrice(1990, .75),
  new ZincPrice(1991, .53),
  new ZincPrice(1992, .58),
  new ZincPrice(1993, .46),
  new ZincPrice(1994, .49),
  new ZincPrice(1995, .53),
  new ZincPrice(1996, .51),
  new ZincPrice(1997, .65),
  new ZincPrice(1998, .51),
  new ZincPrice(1999, .49),
  new ZincPrice(2000, .51),
  new ZincPrice(2001, .40),
  new ZincPrice(2002, .35),
  new ZincPrice(2003, .38),
  new ZincPrice(2004, .48),
  new ZincPrice(2005, .63),
  new ZincPrice(2006, 1.49),
  new ZincPrice(2007, 1.48),
  new ZincPrice(2008, .85),
  new ZincPrice(2009, .75),
  new ZincPrice(2010, .98),
  new ZincPrice(2011, 1),
  new ZincPrice(2012, .88),
  new ZincPrice(2013, .87),
  new ZincPrice(2014, .98),
  new ZincPrice(2015, .88),
  new ZincPrice(2016, .95),
  new ZincPrice(2017, 1.26)
];

class SeigniorageEntry {
  constructor(year, cost, seigniorage) {
    this.year = year;
    this.cost = cost;
    this.seigniorage = seigniorage;
  }
};

const seigniorageData = [
  new SeigniorageEntry(2001, .0080, 25),
  new SeigniorageEntry(2002, .0089, 9),
  new SeigniorageEntry(2003, .0098, 1),
  new SeigniorageEntry(2004, .0093, 5),
  new SeigniorageEntry(2005, .0097, 2),
  new SeigniorageEntry(2006, .0121, -18),
  new SeigniorageEntry(2007, .0167, -40),
  new SeigniorageEntry(2008, .0142, -22),
  new SeigniorageEntry(2009, .0162, -20),
  new SeigniorageEntry(2010, .0179, -27 ),
  new SeigniorageEntry(2011, .0241, -60),
  new SeigniorageEntry(2012, .0200, -58),
  new SeigniorageEntry(2013, .0183, -55),
  new SeigniorageEntry(2014, .0166, -53),
  new SeigniorageEntry(2015, .0143, -39),
  new SeigniorageEntry(2016, .0150, -46),
  new SeigniorageEntry(2017, .0182, -69)
];

export { zincData, seigniorageData };