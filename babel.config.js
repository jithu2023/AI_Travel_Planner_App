module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        // Add these plugins to fix the Text component error
        '@babel/plugin-proposal-export-namespace-from',
        'react-native-web',
      ],
    };
  };