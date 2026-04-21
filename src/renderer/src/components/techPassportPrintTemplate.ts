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
    font-size: 15px !important;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-sizing: border-box;
    align-items: flex-end;
  }

  .model {
    padding-right: 30px !important;
  }

  .model span {
    font-size: 18px !important;
  }

  .main-info-right {
  width: 100%;
  height: 100%;
  padding-top: 13%;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: flex-end;
  justify-content: flex-start;
}

.main-info-right-top {
  display: flex;
  flex-direction: column;
  gap: 21px;
  margin-bottom: 0;
  width: 100%;
  text-align: end;
  justify-content: flex-start;
}

.main-info-right-middle {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 3%;
  width: 63%;
  text-align: end;
  align-items: flex-end;
  justify-content: flex-start;
}

.main-info-right-bottom {
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: end;
  justify-content: flex-start;
  gap: 6px;
  margin-top: 25px;
}

.main-info-right-middle > div,
.main-info-right-bottom > div {
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  min-height: 17px;
}

  .main-info-right-top span,
  .main-info-right-middle span,
  .main-info-right-bottom span {
    display: block;
    width: 100%;
    text-align: right;
  }

.address {
  width: 75%;
  margin-left: auto;
  text-align: right;
  min-height: 26px;   /* база под 2 строки */
  max-height: 39px;   /* максимум под 3 строки */
  overflow: hidden;
}

  .address span {
    display: block;
    width: 100%;
    text-align: right;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
    hyphens: auto;
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

  // .address {
  //width: 75%;
 // text-align: right;
//}

//.address span {
  //display: block;
  //width: 100%;
 // margin-left: auto;
//  white-space: normal;
  //overflow-wrap: break-word;
  //word-break: break-word;
//
//  text-align: right;
//}