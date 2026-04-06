export const TECH_PASSPORT_PRINT_TEMPLATE_STYLES = `
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: Arial, sans-serif;
  }

  * {
    box-sizing: border-box;
    font-size: 11px;
    line-height: 1.15;
    color: #000;
  }

  .container {
    display: flex;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  .main-info-left {
    width: 100%;
    padding-top: 13.5%;
    font-size: 15px!important;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-sizing: border-box;
    align-items: flex-end;
  }

  .model{
    padding-right: 30px!important;
  }

  .model span {
    font-size: 18px !important;
  }

  .main-info-right {
    width: 100%;
    padding-top: 13%;
    font-size: 11px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
    align-items: flex-end;
  }

  .main-info-right-top {
    display: flex;
    flex-direction: column;
    gap: 21px;
  }

  .main-info-right-middle {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 11%;
  }

  .main-info-right-bottom {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 15px;
    width: 25%;
  }

  .address {
    text-align: start;
    font-size: 11px;
    line-height: 1.15;
  }



  .number {
    font-size: 20px !important;
    line-height: 1 !important;
    font-weight: 400 !important;
  }

  .tech-passport-print {
    width: 97%;
    height: 100%;
    box-sizing: border-box;
    padding: 0;
    display: flex;
    flex-direction: column;
    font-size: 11px;
    line-height: 1.15;
  }

  h1, h2, h3, h4, h5, h6, p, span, div {
    font-size: 11px !important;
    line-height: 1.15 !important;
    font-weight: 400;
  }

  h6 {
    display: none !important;
  }

  strong, b {
    font-weight: 500;
  }
`;

export const buildTechPassportPrintHtml = (content: string): string => `
  <html>
    <head>
      <style>
        @page {
          size: auto;
          margin: 0;
        }
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }
        .tech-passport-print {
          width: 100vw;
          height: 100vh;
          box-sizing: border-box;
          padding: 0;
        }
        * {
          box-sizing: border-box;
        }
      </style>
    </head>
    <body>${content}</body>
  </html>
`;


  // .address span {
  //   display: block;
  //   white-space: normal;
  //   overflow-wrap: break-word;
  //   word-break: break-word;
  //   text-align: right;
  //   font-size: 11px;
  //   line-height: 1.15;
  // }