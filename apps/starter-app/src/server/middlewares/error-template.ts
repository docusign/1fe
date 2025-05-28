export const errorTemplate = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex, nofollow" />
    <title><%- pageTitle %></title>
    <link rel="icon" type="image/x-icon" href="<%- favicon %>" />

    <style nonce="<%= cspNonceGuid %>">
      p {
        font-size: 1rem;
        line-height: 1.5;
        margin-top: 8px;
      }
      h1 {
        margin: 0;
      }
      #container {
        font-family: 'DSIndigo';
        margin: 0 auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>

  <body>
    <div id="root">
      <div id="container" data-qa="<%= type %>.browser.page">
        <div>
          <% if(type === 'unsupported' ){ %>
          <h1>Unsupported Browser</h1>
          <p>
            You’re using a version that isn’t supported, update to
            the latest version to continue.
          </p>
          <% } else { %>
          <h1>An error has occurred</h1>
          <p>Make sure your connection is stable and try again</p>
          <button data-qa="server-try-again-btn" id="try-again-btn">
            Try Again
          </button>
          <% } %>
        </div>
      </div>
    </div>

    <script nonce="<%= cspNonceGuid %>">
      const button = document.getElementById('try-again-btn');
      const type = '<%= type %>';

      function handleClick() {
        switch (type) {
          case 'error':
          default:
            // Go the the page that triggered the error
            window.history.go(-1);
            break;
        }
      }

      button.addEventListener('click', handleClick);
    </script>
  </body>
</html>
`;
