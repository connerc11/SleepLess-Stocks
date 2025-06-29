const posts = [
  {
    id: '1',
    title: 'Apple Stock Analysis',
    content:
      'Apple trades at ~28x forward earnings with a $3T market cap. Analysts set a $215 avg price target (+12%). Services revenue hit $23.9B, now 26% of total sales. With over 2B devices, AI integration and Vision Pro are key catalysts for the next leg up.',
    ticker: 'AAPL',
    sentiment: 'Bullish',
    metrics: {
      priceTarget: '$215',
      upside: '+12%',
      peRatio: 28,
      marketCap: '$3T',
    },
  },
  {
    id: '2',
    title: 'Tesla Outlook',
    content:
      'Tesla’s avg price target is $185, slightly below current levels amid margin compression. Deliveries fell YoY, but robotaxi plans and Dojo AI platform could add upside. Analysts remain split: bulls see $250+, bears warn of increasing competition.',
    ticker: 'TSLA',
    sentiment: 'Neutral',
    metrics: {
      priceTarget: '$185',
      downside: '-3%',
      deliveryGrowth: '-8% YoY',
    },
  },
  {
    id: '3',
    title: 'Amazon Growth Strategy',
    content:
      'Amazon’s price target averages $215 (+18%), with AWS expected to grow double digits in 2025. Ads and Buy with Prime boost margins. Cost cuts and AI investment strengthen its moat. Analysts see continued dominance in cloud and e-commerce sectors.',
    ticker: 'AMZN',
    sentiment: 'Bullish',
    metrics: {
      priceTarget: '$215',
      upside: '+18%',
      awsRevenueGrowth: '10% est.',
    },
  },
  {
    id: '4',
    title: 'SoFi Technologies: Fintech Disruptor',
    content:
      'SoFi’s price target stands at $10 (+25%). With $3.4B in deposits and $94M in adj. EBITDA, analysts expect growth in its tech platform and financial services. Bank charter enables lower funding costs, boosting profit potential into 2025.',
    ticker: 'SOFI',
    sentiment: 'Bullish',
    metrics: {
      priceTarget: '$10',
      upside: '+25%',
      deposits: '$3.4B',
      ebitda: '$94M',
    },
  },
  {
    id: '5',
    title: 'Upstart Holdings: AI Lending Future',
    content:
      'Upstart has a $26 avg price target (+30%). Despite credit headwinds, AI-powered underwriting drives efficiencies. Originations are recovering; analysts note potential in SMB and auto loans. Volatility remains high but upside is compelling long-term.',
    ticker: 'UPST',
    sentiment: 'Bullish',
    metrics: {
      priceTarget: '$26',
      upside: '+30%',
      creditQuality: 'Improving',
    },
  },
  {
    id: '6',
    title: 'Robinhood: Investing for All',
    content:
      'Robinhood’s PT averages $22 (+18%). It holds $121B in assets under custody and 12.5M monthly users. Retirement accounts and options trading drive engagement. Analysts cite monetization improvements and potential crypto recovery as growth levers.',
    ticker: 'HOOD',
    sentiment: 'Bullish',
    metrics: {
      priceTarget: '$22',
      upside: '+18%',
      aum: '$121B',
      users: '12.5M MAUs',
    },
  },
  {
    id: '7',
    title: 'Hims & Hers Health: Telehealth Growth',
    content:
      'HIMS trades with a $15 PT (+20%). Revenue grew 68% YoY, with 1.5M subscriptions and gross margin at 79%. Analysts like DTC growth, recurring revenue, and OTC expansion. Telehealth trends and brand loyalty fuel longer-term profitability potential.',
    ticker: 'HIMS',
    sentiment: 'Bullish',
    metrics: {
      priceTarget: '$15',
      upside: '+20%',
      revenueGrowth: '68% YoY',
      subscriptions: '1.5M',
    },
  },
  {
    id: '8',
    title: 'Capital One: Credit Powerhouse',
    content:
      'Capital One trades near a $150 PT (+12%). Credit card revenue remains strong, and digital adoption is up. CET1 ratio at 10.4% and NIM over 6%. Analysts expect consistent performance amid rising interest rates and stable loan demand.',
    ticker: 'COF',
    sentiment: 'Neutral',
    metrics: {
      priceTarget: '$150',
      upside: '+12%',
      cet1: '10.4%',
      nim: '6.1%',
    },
  },
];

export default posts;
