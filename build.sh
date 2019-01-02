#!/bin/bash

now=`date +%Y%m%d%H%M%S`

version=$1
if [ "$1" == "" ]; then
    echo "Version not found, perform snapshot build"
    version=$now
fi


if [ ! -d ../build ]; then
    mkdir ../build
fi

dir=$PWD
export buildDir=$(cd ../build; pwd)

targetDirName=warlock-$version
targetDir=$buildDir/warlock/$targetDirName
targetFile=warlock-$version.tar.gz

npm run clean
rm -rf run
rm -rf $targetDir
mkdir -p $targetDir

echo "build warlock..."
npm run build &>/dev/null
if [ "$?" != "0" ]; then
    echo "build warlock failed"
    exit -1
fi

echo "mkdir..."
if [ ! -d $buildDir ]; then
    mkdir $buildDir
fi
if [ ! -d $targetDir ]; then
    mkdir $targetDir
fi

echo "cp..."
cp -r app $targetDir
cp -r config $targetDir
cp -r images $targetDir
cp -r public $targetDir
cp package.json $targetDir
cp prod.sh $targetDir
echo $version > $targetDir/Version

echo "npm i --production..."
cd $buildDir/warlock/$targetDirName
npm i --production &>/dev/null
if [ "$?" != "0" ]; then
    echo "npm prod failed"
    exit -1
fi

echo "tar..."
cd $buildDir/warlock
tar -zcvf $targetFile $targetDirName &>/dev/null
cd $dir

echo "clean..."
rm -rf $buildDir/warlock/$targetDirName

echo "build done"
echo $version
