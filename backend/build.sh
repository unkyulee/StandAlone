pushd ../frontend
npm run build
popd
cp ../frontend/dist/index.html ./src/index.html
clasp push