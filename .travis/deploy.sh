OWNER="Process-Creative"

git config core.autocrlf true
git config core.filemode false
npm config set "@process-creative:registry" "https://npm.pkg.github.com/" --global

git remote set-url origin https://${GH_TOKEN}@github.com/${OWNER}/slate-v2.git
git fetch --all
git checkout master
yarn lerna version patch --conventional-commits --yes --exact
git push --follow-tags
git checkout master

for D in `find ./packages/ -mindepth 1 -maxdepth 1 -type d`
do
  echo "registry=https://npm.pkg.github.com/" > "${D}/.npmrc"
  echo "//npm.pkg.github.com/:_authToken=${GH_TOKEN}" > "${D}/.npmrc"
done
echo "registry=https://npm.pkg.github.com/" > ".npmrc"
echo "//npm.pkg.github.com/:_authToken=${GH_TOKEN}" > ".npmrc"

yarn lerna publish from-package --yes --registry //npm.pkg.github.com