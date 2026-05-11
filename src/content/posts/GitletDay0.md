---
title: GitletDay0
published: 2026-01-28
tags: [Gitlet]
category: 技术总结
draft: false
---

 - 为防止init_commit的重复创建，应把init_commit写入.gitlet，一次创建，其他地方直接引用 
- sha接受byte数组，需要readContents先转化为 byte[]
- 暂存区分tobeadded和tobeDeleted两种
- 获取timeStamp:

```java
Date now = new Date();

Date inittime = new Date(0);//the init time 'Thursday, 1 January 1970'
```

转换得到`String`类型的timeStamp

```java
static String dateToTimeStamp(Date date) {
        DateFormat dateFormat = new SimpleDateFormat("EEE MMM d HH:mm:ss yyyy Z", Locale.US);
        return dateFormat.format(date);
    }
```

- 对于每个commit，其hashID通常这样得到
```
sha1(Map.toString(), getParentCommit(), getMessage(), getTime());

```
 而非通过把commit暂存为序列化后的文件来计算hash, 可能java序列化不太稳定？
 反正不适合用来算hash
 
- 由于过度依赖序列化导致我把很多指针直接写成文件来存储，这是错误的
- 考虑到后面肯定是要调试的，临时写的这一坨明天得重构一下，这个项目骨架还是给太多了，如果不是因为后面有gradescope, 那我会考虑把这些骨架全都删了，就留个Utils和main，
- 看了别人写gitlet的感受之后感觉有点不对，我应该把他当成一个自由的项目来写，而不是边写边一字一句看文档，毕竟gitlet长什么样不用看文档也足够清楚
