#! /bin/bash

# RUN IT FROM ROOT PROJECT FOLDER - 'node-liquibase'

# Test version argument.
if [ -z "$1" ]; then
  echo 'A release version must be supplied (e.g. 7.0.1).'

  exit 1
fi
LIQUIBASE_VERSION=$1

# Get current working dir.
PWD=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
echo $PWD

# Move to appropriate working dir.
mkdir -p tmp
cd ./tmp

# Prepare a new branch for this update.
git checkout -b versioned-release/liquibase-${1//\./\-} || git checkout versioned-release/liquibase-${1//\./\-}

# Download the requested tagged release.
echo "Downloading Liquibase Release Version $1..."

# curl -L -s https://github.com/googlei18n/libphonenumber/archive/v$1.tar.gz -o v$1.tar.gz
TARBALL_FILE_NAME=liquibase-${LIQUIBASE_VERSION}.tar.gz
wget -O $TARBALL_FILE_NAME "https://github.com/liquibase/liquibase/releases/download/v${LIQUIBASE_VERSION}/liquibase-${LIQUIBASE_VERSION}.tar.gz" || rm $TARBALL_FILE_NAME

# Logic Branch for downloaded tarball.
if [ -f "$TARBALL_FILE_NAME" ]; then
	# If it was downloaded...
	mkdir -p ./liquibase
	tar -xf $TARBALL_FILE_NAME --directory ./liquibase

	# Remove previous Liquibase dir in `/bin`.
	find ../bin -depth 1 ! -iregex '../bin/liquibase/liquibase' | xargs rm -rf
	mkdir -p ../bin/liquibase

	# Copy in the new Liquibase directory
	cp -r ./liquibase ../bin

	# Remove the old Tarball
	rm $TARBALL_FILE_NAME

	rm -rf ./liquibase

	# Update package.json version w/ $LIQUIBASE_VERSION
	# Linux approach...
	sed -i 's|\(.*"version"\): "\(.*\)",.*|\1: '"\"$LIQUIBASE_VERSION\",|" ../package.json

	# Get npm package version number.
	PACKAGE_VERSION=$(cat ../package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
	| xargs)
	echo "Version in package.json is $PACKAGE_VERSION"
	echo "Liquibase version is $LIQUIBASE_VERSION"

	# Compare NPM version number and Liquibase version.
	if [[ "$PACKAGE_VERSION" != "$LIQUIBASE_VERSION" ]]; then
		echo "The package.json version does not match the Liquibase version!"

		printf "\n"
		echo "Trying a different technique..."
		sed -i '' "s/\"version\": \"${PACKAGE_VERSION}\"/\"version\": \"${LIQUIBASE_VERSION}\"/" ../package.json

		# Re-Evaluate package.json version.
		PACKAGE_VERSION=$(cat ../package.json \
			| grep version \
			| head -1 \
			| awk -F: '{ print $2 }' \
			| sed 's/[",]//g' \
			| xargs)
		echo "Version in package.json is $PACKAGE_VERSION"
		echo "Liquibase version is $LIQUIBASE_VERSION"


		if [[ "$PACKAGE_VERSION" != "$LIQUIBASE_VERSION" ]]; then
			echo "The package.json version does not match the Liquibase version!"
			exit 1;
		fi
	fi

	# Build the library
	yarn build

	# Add the modified files to git.
	git add $PWD/../bin
	git add $PWD/../package.json
	git add $PWD/../dist

	# Commit with the standard message.
	git commit -m "(release): updated bundled Liquibase to match release v$LIQUIBASE_VERSION"

	echo "Done!"
else
	# If it was NOT downloaded...
	echo "$TARBALL_FILE_NAME was not downloaded. Please ensure that you've supplied a valid version number for a Liquibase release."
fi
