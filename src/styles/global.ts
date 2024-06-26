import { createGlobalStyle } from "styled-components";
import { colors, shadows } from "theme/colors";
import { darkColors, darkShadows } from "theme/colors/dark";
import theme, { createCssDefinition } from "theme";
import { defineColorTheme } from "styles/mixins";
import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"], weight: "variable" });

export default createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    html, body, #__next {
        // Every container in the page hierarchy needs to have the 
        // maximum height of the viewport. Using 100vh on innermost container 
        // would break certain layouts on mobile devices.
        height: 100%;
    }
    
    :root {
        ${defineColorTheme("light")`
            ${createCssDefinition(colors)}
            ${createCssDefinition(shadows)}
        `}

        ${defineColorTheme("dark")`
            ${createCssDefinition(darkColors)}
            ${createCssDefinition(darkShadows)}
        `}
        
        scrollbar-color: ${theme.colors["gray-700"]} transparent;
        scrollbar-width: thin;

        // To prevent layout shift, we want to keep the spacing
        // of the scrollbar even if the page isn't scrollable.
        scrollbar-gutter: stable;

        &[data-fullscreen] {
            // Except in fullscreen mode.
            scrollbar-gutter: revert;
        }
    }
    
    body {
        margin: 0;

        background-color: ${theme.colors["background"]};
        color: ${theme.colors["text"]};

        font-family: ${nunito.style.fontFamily}, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        line-height: 1.5;
        
        // If scrollbar-gutter isn't supported we achieve 
        // the same effect, by forcing a scrollbar.
        @supports not (scrollbar-gutter: stable) {
            overflow-y: scroll;
        }

        [data-fullscreen] & {
            // Except in fullscreen mode.
            overflow-y: hidden;
        }
    }

    a {
        color: inherit;
        text-decoration: inherit;
    }

    p {
        line-height: inherit;
    }

    button {
        border: none;
        margin: 0;
        padding: 0;
        width: auto;
        overflow: visible;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: inherit;
        outline: none;
        line-height: inherit;
        -webkit-appearance: none;
    }

    input {
        width: 100%;
        border: none;
        outline: none;
        background-color: transparent;
        color: inherit;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;

        ::placeholder {
            color: ${theme.colors["text-muted"]};
        }
    }

    img, video {
        display: block;
        max-width: 100%;
    }

    pre, ul {
        margin: 0;
    }

    hr {
        margin: 16px 0;
        border-color: ${theme.colors["text-disabled"]};
    }

    @media (pointer: fine) {
        ::-webkit-scrollbar {
            width: 6px;
            height: 12px;
            background-color: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background-color: ${theme.colors["gray-700"]};

            &:hover {
                background-color: ${theme.colors["gray-500"]};
            }
        }
    }
`;
