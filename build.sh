
## Configure proxy to enable npm install to go out to external world.

export HTTP_PROXY=http://localhost:3128
export HTTPS_PROXY=http://localhost:3128

## Modify build id in env.json
source ./build_id.sh

## Find all globally installed modules and remove it.
## npm ls -gp --depth=0 | awk -F/node_modules/ '{print $2}' | grep -vE '^(npm|)$' | xargs -r npm -g rm

## Install npm modules.
echo "START: npm install"
npm install
echo "END: npm install"

## Modify env.json, package.json and gruntfile.js to correct version number.
## version number in gruntfile.js is used to version assets (application.js and application.css)
## NOTE: npm install needs to be before version renames.

sed -i -e "s/0.0.0/${BUILD_ID}/g" ./public/env.json
sed -i -e "s/0.0.0/${BUILD_ID}/g" package.json
sed -i -e "s/0.0.0/${BUILD_STRING}/g" gruntfile.js

echo "Remove public/index.html"
rm -f public/index.html
mkdir -p target

echo "Build: grunt build"
export NODE_ENV=production
grunt build

cp -R ./public ./web-${BUILD_ID}
rm -rf target/*.tgz
tar czf "target/web-${BUILD_ID}.tgz" ./web-${BUILD_ID}
rm -rf ./web-${BUILD_ID} 