module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],

  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },

  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.less$/,
      use: [
        { loader: "style-loader" },
        { loader: "css-loader", options: { modules: false } },
        {
          loader: "less-loader",
          options: { lessOptions: { javascriptEnabled: true } },
        },
      ],
    });
    return config;
  },
};
