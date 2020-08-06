OWNER="Process-Creative"

git config core.autocrlf true
git remote set-url origin https://${GH_TOKEN}@github.com/${OWNER}/slate-v2.git
git fetch --all
git checkout master
yarn lerna version patch --conventional-commits --yes --exact
git push --follow-tags
git checkout master

for D in `find ./packages/ -mindepth 1 -maxdepth 1 -type d`
do
  echo "//npm.pkg.github.com/:_authToken=${GH_TOKEN}" > "${D}/.npmrc"
done
echo "//npm.pkg.github.com/:_authToken=${GH_TOKEN}" > ".npmrc"

yarn lerna publish from-package --yes --registry //npm.pkg.github.com