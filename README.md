# 安装软件

> 注：安装之前请确保手机上已经卸载Expo Go软件。

## Android

`.apk.zip` [下载链接](‘https://bhpan.buaa.edu.cn:443/link/552FDE05F3EE1BDE220238B7612EDA84’)，有效期至2022-07-01 23:59。

## iOS

正在测试TestFlight平台。



# Contributing Rule

```bash
$ git checkout main
$ git pull
$ git checkout -b dev-[feature or patch name]-[your name]  # 切换到新分支 
$ webstorm .  # 在新的分支上修改
$ git add [files ..]
$ git commit -m "[feature] by [your name]: [changes]"
$ git pull origin main --rebase  # 拉取上游更改
$ # 可能需要解决冲突
$ git push -u origin dev-[feature or patch name]-[your name]
$ # 开启 Pull Request
```

**branch、文件名等可能存在的空格使用 `_` 下划线代替。**

举一个例子🌰，比如张三丰先生今天给我们的项目新添了一个待办列表的功能，那么他将运行这几步：

```bash
$ git checkout main
$ git pull
$ git checkout -b dev-todo_list-sanfeng 
$ webstorm .  # 在新的分支上修改
$ git add .	  # 酌情使用 .
$ git commit -m "TODO List by Sanfeng: Add a TODO List for the app."
$ git pull origin main --rebase
$ # 三丰先生可能需要解决冲突
$ git push -u origin dev-todo_list-sanfeng
$ # 三丰先生觉得可以了，于是在 GitLab 开启了 Pull Request
```



## What if…

想撤销一次没有push的commit：

```bash
git reset --soft HEAD^
```

想撤销n次没有push的commit：

```bash
git reset --soft HEAD~n
```

想修改这次commit的 `-m`：

```bash
git commit --amend -m "这才是要提交的文字"
```

想删除本地一个branch：

```bash
git branch -d 想删除的branch
```

