rm -r dist 2> /dev/null
npx tsc

cp ./package.json ./dist
cp ./README.md ./dist
cp ./LICENSE ./dist