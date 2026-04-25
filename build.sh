rm -r dist 2> /dev/null
npx tsc
mv ./dist/aquanore/** ./dist/
rm -r ./dist/aquanore/

cp ./package.json ./dist
cp ./README.md ./dist
cp ./LICENSE ./dist