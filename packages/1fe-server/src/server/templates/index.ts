const indexTemplate = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <base href="<%- baseHref %>" />
    <meta charset="utf-8" />
    <% if ( typeof metaTags !=='undefined' && metaTags && metaTags.length ) { 
      metaTags.forEach(function(metaTagEntries) { %>
        <meta <%- metaTagEntries %> >
    <% });
  } %>

    <link rel="icon" type="image/x-icon" href=<%- favicon %>>

    <title id="oneds-title"><%- pageTitle %></title>
    <link rel="preload" as="script" href="<%= shellBundleUrl %>" crossorigin="anonymous"></link>
    <script type="systemjs-importmap" crossorigin="anonymous">
      <%- JSON.stringify(systemJsImportMapConfig) %>
    </script>
    <script type="application/json" data-1fe-config-id="plugin-config">
      <%- JSON.stringify(pluginConfigs) %>
    </script>
    <script type="application/json" data-1fe-config-id="widget-config">
      <%- JSON.stringify(widgetConfigs) %>
    </script>
    <script type="application/json" data-1fe-config-id="dynamic-config">
      <%- JSON.stringify(dynamicConfigs) %>
    </script>
    <script type="application/json" data-1fe-config-id="env-config">
      <%- JSON.stringify(envConfigs) %>
    </script>
    <script type="application/json" data-1fe-config-id="lazy-loaded-libs-config">
      <%- JSON.stringify(lazyLoadedLibsConfig) %>
    </script>

    <% if (
      typeof preloadableStaticAssetURLs !== 'undefined'
      && preloadableStaticAssetURLs
      && preloadableStaticAssetURLs.length
    ) {
      preloadableStaticAssetURLs.forEach(function(preloadURL) { %>
        <link rel="preload" as="script" href="<%= preloadURL %>" crossorigin="anonymous"></link>
      <% });
    } %>

    <% if (
      typeof preloadableFetchAPIURLs !== 'undefined'
      && preloadableFetchAPIURLs
      && preloadableFetchAPIURLs.length
    ) {
      preloadableFetchAPIURLs.forEach(function(preloadURL) { %>
        <link rel="preload" as="fetch" href="<%= preloadURL %>" crossorigin="anonymous"></link>
      <% });
    } %>
  </head>
  <body>
    <div id="root"></div>
    <script nonce="<%= cspNonceGuid %>">
      function onError(err) {
        console.error('Something went wrong initializing 1fe-app', err);

        // Non user initiated calls do not add to history to be able to go back 
        history.pushState({}, "", window.location.href);
        window.location.href = \`/error?cause=initialization&widgetPath=\${window.location.pathname}\`
      }

      // TODO[1fe][post-mvp]: Add retry of critical imports
      function onSystemReady() {
        System.import("<%= criticalLibraryConfigUrls.SystemAMD %>").then(() => {
          System.import('<%= shellBundleUrl %>').catch(onError);
        }).catch(onError);
      }
    </script>
    <script nonce="<%= cspNonceGuid %>">
      const systemScript = document.createElement('script');
      systemScript.src = '<%= criticalLibraryConfigUrls.System %>';
      systemScript.async = true;
      systemScript.crossOrigin = 'anonymous';
      systemScript.fetchPriority  = 'high';
      systemScript.onload = onSystemReady;
      systemScript.onerror = onError;
      document.head.appendChild(systemScript);
    </script>
    <script fetchpriority="high" src="<%= criticalLibraryConfigUrls.ImportMapOverride %>" async crossorigin="anonymous"></script>

    <meta name="importmap-type" content="systemjs-importmap" />
    <% if (!isProduction && !hideImportMapOverrideElement) { %>
      <import-map-overrides-full></import-map-overrides-full>
    <% } %>

    <script nonce="<%= cspNonceGuid %>">
      var telemetry = {
        mark: (name, context) => {
          if (performance && typeof performance.mark === 'function') {
            performance.mark(name, context)
          }
        }
      }

      telemetry.mark("@1fe/shell-start");
    </script>
  </body>
</html>
`;

const getTemplate = () => {
  return indexTemplate;
};

export { getTemplate };
