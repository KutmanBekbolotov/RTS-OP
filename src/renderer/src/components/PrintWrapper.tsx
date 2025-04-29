export const PrintWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <div>
        <style>
          {`
            @media print {
              @page {
                size: 14.80cm 10.50cm;
                margin: 0;
              }
              .tech-passport-print {
                background-color: red !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                width: 14.80cm;
                height: 10.50cm;
                padding: 0.5cm;
                box-sizing: border-box;
                position: relative;
              }
              .tech-passport-print::before {
                content: "ТЕСТ ПЕЧАТИ";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 32px;
                color: white;
                opacity: 0.5;
                pointer-events: none;
                white-space: nowrap;
              }
              h6 {
                display: none !important;
              }
            }
          `}
        </style>
        {children}
      </div>
    );
  };
  