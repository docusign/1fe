import { isEmpty } from 'lodash';
import { readOneFEShellConfigs } from '../configs/shell-configs';
import {
  clearRuntimeConfigOverrides,
  getParsedRuntimeConfigOverrides,
} from '../utils/runtime-configs';
import { WIDGET_URL_OVERRIDES } from '../constants/search-params';
import { DYNAMIC_CONFIGS } from '../configs/config-helpers';

const isOverrideActive = (element: HTMLElement) => {
  const isActiveImportMapOverride = element.classList?.value.includes(
    'imo-current-override',
  );

  return (
    isActiveImportMapOverride || !isEmpty(getParsedRuntimeConfigOverrides())
  );
};

const selectImportMapOverrideButton = () =>
  selectImportMapOverrideUi()?.querySelector(
    'button.imo-trigger',
  ) as HTMLButtonElement;

export const selectImportMapOverrideUi = () =>
  document.querySelector('import-map-overrides-full')?.shadowRoot;

export const getImportMapOverridesButton = () =>
  document
    ?.getElementsByTagName('import-map-overrides-full')[0]
    ?.shadowRoot?.querySelector('button');

export const isOverrideElementActive = () => {
  const element = getImportMapOverridesButton();

  if (!element) {
    return false;
  }

  return isOverrideActive(element);
};

/**
 * When we hit the OneDsErrorBoundary, we want to show the import map override button
 * in case the user has a broken override url ao they can reset/fix it.
 */
export const showImportMapOverrideButton = () => {
  const button = selectImportMapOverrideButton();

  if (button) {
    button.style.display = 'flex';
  }
};

// flash red when override is active
const animateImportMapButtonIfOverrides = () => {
  const colors: string[] = ['red', 'salmon'];
  let colorIndex = 0;
  let animationInterval: number | null = null;
  let scale = 1;

  setInterval(() => {
    const element = document
      ?.getElementsByTagName('import-map-overrides-full')[0]
      ?.shadowRoot?.querySelector('button');

    if (!element) {
      return;
    }

    const isActiveOverride = isOverrideActive(element);

    if (isActiveOverride && !animationInterval) {
      const animationSpeed = '0.75s';

      element.style.transition = `background-color ${animationSpeed}, transform ${animationSpeed}`;

      const tooltip = document.createElement('span');
      tooltip.id = 'activeImportMapTooltip';
      tooltip.textContent = 'You have active overrides';

      Object.assign(tooltip.style, {
        display: 'none',
        position: 'absolute',
        bottom: '75px',
        right: '10px',
        padding: '10px',
        width: 'auto',
        fontSize: '16',
        backgroundColor: '#F0EAD6',
        color: 'black',
        borderRadius: '5px',
      });

      document.body.appendChild(tooltip);

      element.addEventListener('mouseover', () => {
        tooltip.style.display = 'block';
      });

      element.addEventListener('mouseout', () => {
        tooltip.style.display = 'none';
      });

      animationInterval = window.setInterval(() => {
        element.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;

        scale = scale == 1 ? 1.25 : 1;
        element.style.transform = `scale(${scale})`;
      }, 750);
    } else if (!isActiveOverride && animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;

      element.style.transition = '';
      element.style.backgroundColor = 'navajowhite';
      element.style.transform = 'scale(1)';

      const tooltip = document.getElementById('activeImportMapTooltip');

      if (tooltip) {
        document.body.removeChild(tooltip);
      }
    }
  }, 100); // Check for the existence of the element
};

/**
 *
 * DRY helper function to add a button to the import map overrides ui
 *
 * @param textContent innerHtml
 * @param onClick callback for clicking button
 * @param applyCustomStyling optionally add extra styling, eg a glow effect
 *
 * @returns additional button for the import map override ui
 */
const copyImportMapOverridesButton = (
  textContent: string,
  onClick: (...args: any[]) => void,
  applyCustomStyling: (button: HTMLButtonElement) => void = (button) => button,
) => {
  const importMapOverrides = document
    ?.getElementsByTagName('import-map-overrides-full')[0]
    ?.shadowRoot?.querySelector('.imo-table-header-actions');

  if (!importMapOverrides) {
    return;
  }
  // create a div with class class="imo-add-new" and append the button to it
  const divElement = document.createElement('div');
  divElement.className = 'imo-add-new';

  const copyButton = document.createElement('button');
  copyButton.textContent = textContent;
  copyButton.addEventListener('click', onClick);
  applyCustomStyling(copyButton);

  divElement.appendChild(copyButton);
  importMapOverrides?.appendChild(divElement);
};

const deleteImportMapOverridesButton = () => {
  const element = getImportMapOverridesButton();

  if (element) {
    element.remove();
  }
};

/**
 * Override the https://github.com/single-spa/import-map-overrides ui because we are that good
 *
 * @returns void
 */
export const initializeImportMapOverridesReskin = () => {
  /**
   * Workaround to ensure the import map button is hidden on refresh.
   *
   * Reason:
   * When the stale-while-revalidate service worker fetches index.html, it is not allowed to use cookies like '@1fe/active-automated-test-framework'
   *
   * As a result, `hideImportMapOverrideElement` in the index.html.ejs does not hide the import map overrides button on refresh
   */
  const IS_PROD = readOneFEShellConfigs().mode === 'production';
  const enableUI =
    DYNAMIC_CONFIGS?.devtools?.importMapOverrides?.enableUI || true;
  // const getIsActiveAutomatedTestFramework = false;
  if (IS_PROD || enableUI === false) {
    deleteImportMapOverridesButton();
    return;
  }

  // animate the import map button if there are overrides
  animateImportMapButtonIfOverrides();

  // style the overrides popup
  const overrideShadowRoot = selectImportMapOverrideUi();

  if (!overrideShadowRoot) {
    return;
  }

  const shadowRootCss = new CSSStyleSheet();
  shadowRootCss.replaceSync(`
      .imo-popup { color: #343434; background: rgb(255, 255, 255); font-family: "DS Indigo", DSIndigo, Helvetica, Arial, sans-serif; border-top: 4px solid rgb(38, 70, 83); } 
      .imo-header a {color: rgb(42, 157, 143);}
      .imo-table-header-actions { padding: 2rem; border: 2px dashed rgb(42, 157, 143); display: flex; }
      .imo-list-search { flex-grow: 1; height: 35px;
                        box-sizing: border-box;
                        font-family: inherit;
                        font-size: 14px;
                        letter-spacing: .16px;
                        border-radius: 0;
                        outline: 2px solid transparent;
                        outline-offset: -2px;
                        border: none;
                        border-bottom: 1px solid #8d8d8d;
                        background-color: #f4f4f4;
                        padding: 0 16px;
                        color: #161616;
                     }
      .imo-list-container button { height: 35px; }
      .imo-add-new button { cursor: pointer; border-radius: 8px; border: 1px solid #666; background: #f2f2f2; color: #232323; }
      .imo-header .imo-unstyled { color: black; }
      .imo-overrides-table thead { background: #e9edc9; }
      .imo-overrides-table { width: 100%; background: rgb(254, 250, 224); }
      .imo-overrides-table td, .imo-overrides-table th { border: 1px solid #7b7b7b; }
      .imo-overrides-table tbody tr:hover { background: #dddddd; }
      .imo-default-module { background-color: #dddddd; }
      .imo-popup a:visited, .imo-popup a { color: rgb(42, 157, 143); }
      `);
  overrideShadowRoot.adoptedStyleSheets.push(shadowRootCss);

  // style the overrides modal
  const documentCss = new CSSStyleSheet();
  documentCss.replaceSync(`
      .imo-module-dialog { border: white; }
      .imo-modal-container * { font-family: "DS Indigo", DSIndigo, Helvetica, Arial, sans-serif; }
      .imo-module-dialog.imo-overridden {  }
      .imo-dialog-actions button { cursor: pointer; border-radius: 8px; border: 1px solid #666; background: #f2f2f2; color: #232323; height: 35px; } 
      .imo-module-dialog table td:first-child { font-weight: bold; }
      .imo-module-dialog h3 { padding-bottom: 0.5rem; border-bottom: 1px solid #ddd; }
      .imo-dialog-actions { display: flex; align-items: center; justify-content: center; } 
      `);
  document.adoptedStyleSheets.push(documentCss);

  // handle the content updates in the popup
  overrideShadowRoot
    ?.querySelector('button.imo-trigger')
    ?.addEventListener('click', () => {
      if (overrideShadowRoot?.querySelector('.imo-header h1')) {
        (
          overrideShadowRoot.querySelector('.imo-header h1') as Element
        ).innerHTML = '1FE Widget Overrides';
        (overrideShadowRoot.querySelector('.imo-header p a') as any).href =
          'https://github.docusignhq.com/pages/Core/1fe-docs/widgets/development/overrides/';
      }

      // add copy import map overrides button
      copyImportMapOverridesButton('Copy overrides', () => {
        const copyLink = new URL(window.location.href);
        copyLink.searchParams.set(
          WIDGET_URL_OVERRIDES,
          JSON.stringify(window.importMapOverrides.getOverrideMap().imports),
        );
        const textArea = document.createElement('textarea');
        textArea.value = copyLink.toString();
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      });

      if (!isEmpty(getParsedRuntimeConfigOverrides())) {
        copyImportMapOverridesButton(
          'Clear runtime config overrides',
          clearRuntimeConfigOverrides,
          // animate the button to glow on an interval
          (button) => {
            let colorIndex = 0;
            let animationInterval: number | null = null;

            if (!animationInterval) {
              // flash red when override is active
              const colors: string[] = ['red', 'salmon'];
              const animationSpeed = '0.75s';
              button.style.transition = `background-color ${animationSpeed}`;

              animationInterval = window.setInterval(() => {
                button.style.backgroundColor = colors[colorIndex];
                colorIndex = (colorIndex + 1) % colors.length;
              }, 750);
            } else if (animationInterval) {
              clearInterval(animationInterval);
              animationInterval = null;
              button.style.backgroundColor = 'navajowhite';
            }
          },
        );
      }
    });
};
