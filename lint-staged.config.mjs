const lintstagedConfig = {
  '**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '**/*.{json,css,md}': ['prettier --write'],      
}

export default lintstagedConfig
