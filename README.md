# Binary Diff

将对比结果并排差异显示

## Usage

对比结果保存到gist仓库中，`Gist ID`必选，`File Name`可选

### 第一种用法

1. [www.z1r0.top/binarydiff/?Gist ID](http://www.z1r0.top/binarydiff/)

   `Gist Id`替换成gist仓库id

   默认预览`Gist ID`对应的第一个文件

2. [www.z1r0.top/binarydiff/?Gist ID/File Name](http://www.z1r0.top/binarydiff/)

   预览`Gist ID`仓库里的特定的`File Name`

### 第二种方法

1. 在`Gist ID`里输入gist仓库id，默认预览第一个文件
2. 输入`File Name`即可预览`Gist ID`仓库里的特定的`File Name`

## Example

https://www.z1r0.top/binarydiff/?01b49f04d0aff9e0951ced399418dd93/afd.sys.x64.10.0.22621.1028.sqlite-afd.sys.x64.10.0.22621.1415.sqlite.diff

## Github API Rate Limiting

Unauthenticated requests are associated with your IP address, and not the user making requests. The rate limit allows you to make up to `60` requests per hour.
