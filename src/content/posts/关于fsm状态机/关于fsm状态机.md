---
title: 关于FSM状态机
published: 2025-12-01
tags: [Minecraft, Mods]
category: Minecraft modding
draft: false
---
# 本篇基于Modo在写<a href="https://modrinth.com/mod/flee-on-sight">*Flee On Sight*</a>时的感想
### 对于较复杂的状态判断，有一种更好的方法
#### 为什么不用if-else ?:
首先，对于大量子状态的判定会在这种boolean的判定中越来越冗长，如果是写了辅助方法来包装则会有层层嵌套的问题，而且对于几个不相关的子boolean强行包装成一个辅助boolean会导致可读性下降，最终整体的状态判定会很难维护

同时，最最危险的一点在于if-else的各种子状态判定一旦存在耦合，会变得非常非常麻烦
举个例子，我们判断一只羊是否应该逃跑（记为isFleeing）, 假设isFleeing这个boolean由两个子状态A和B来判定：

    A 代表空间判定（包含视角判定，空间距离判定）

    B 代表食物引诱判定（即羊不应在受吸引时逃跑）
        
或许这个时候你会想这么写
```
if (A && B) {
    isFleeing = true;
}
```
然而事实是B中实际上嵌套了A中的部分空间逻辑🤓，这意味着 A 与 B 并不是两个独立条件，这就非常头疼了

通常接下来你有两种常规的处理这玩意的思路：

    第一种是打补丁：在A中嵌套B联合一些其他的空间状态判定，从而在耦合的那块地方强行用B覆盖A(假如决策系统稍微再复杂一点点甚至会需要A与B互相嵌套)。
    最终A与B之间的耦合度越来越高导致会严重破坏抽象，可以想象调试这个逻辑时在两个子状态判定之间反复横跳的场景。

    第二种是强行拆散耦合，直接不要这两个较大的子状态，把他们拆散成一个个小的boolean判定。
    但这就没有封装了，可读性就不要想了，面对一堆boolean维护起来也是极其困难。



### 那么 ，该到我们的FSM有限状态机登场了！
Modo被羊的if-else折磨得死来活去时，突然发现了有限状态机FSM这个好东西

#### 从羊的角度切入：
        有限状态机相当于把羊赋予一个’状态‘，状态可以有有限个种类

        但是一只羊同时有且仅有一个状态

        每个状态之间有精确的进入和退出条件

        我们把羊的状态分为如下三个种类：陌生，逃跑，友好

![](./FSM.png)

我们现在先根据之前我们想要通过if-else达到的目的效果来想想各个状态是什么意思：
        
        陌生：
            对玩家存在警觉，但不是逃跑
        逃跑：
            字面意义，即处于逃跑状态
        友好：
            对玩家毫无防备
        

接下来我们根据各个状态间的关系添加进入/退出条件即可
        （注意，这些是进入/退出条件，也就是说状态是可以持续的，不改变的）


![](./fsm2.png)

        每个tick中，羊仅处于一种状态中，

        只有当状态为逃跑时，羊才会调用逃跑方法

以下为具体代码实现：
```java
public enum State {
    DEFAULT_EMPTY,
    FLEEING,
    FRIENDLY
}
```
```java
switch (mobState.currentState){
            case DEFAULT_EMPTY:
                if(FOVcheck(animal, player) && player.isHolding(Items.WHEAT) && distance <= 8.2){
                    mobState.currentState = FRIENDLY;
                }
                else if(distance <= 8 && FOVcheck(animal, player)){
                    mobState.currentState = FLEEING;
                }
                break;

            case FRIENDLY:
                if(animal.getAttacker() == player){
                    mobState.currentState = FLEEING;
                }
                break;

            case FLEEING:
                 if(distance >= 20){
                    mobState.currentState = DEFAULT_EMPTY;
                }
                break;
        }
```
我们当然也可以用if-else去做到这件事，
但是比起用if-else系统，状态机的可读性和可维护性会好很多。

实际上上述提到的这个羊的行为逻辑只是较规模小的一点实现，一旦决策系统更加庞大之后，状态机的优势就会更好地体现出来

原因在于：

    - 我们每时每刻只处于一个状态中

    - 我们只要管好局部每个状态时的进入和退出条件即可，可以忽略其他状态之间的交互细节，极大程度上降低了耦合度

### 杂谈：
- 上述状态机的具体实现只是其中的一种简单形式， 在Java中即是使用enum配合switch来构成状态机，对于更重型的状态机，有更严谨和标准的方式通过接口来实现（一个真正意义上完整的状态机包含：状态，转换，和执行，其中执行可以在特定状态下也可以在转换时）

- 状态机可以应付复杂的状态判定中，所以被大量运用在游戏ai逻辑处理中， 包括你可以在mc的反编译源码中找到它

- 推荐一篇极好的状态机讲解 https://youtu.be/-ZP2Xm-mY4E?si=Qg5BXm2E3TQxlltM