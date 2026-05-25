---
title: OpenTelemetry：可观测性需求的一步步演变
published: 2026-03-28
tags: [OpenTelemetry]
category: 技术总结
draft: false
---

## Logs
在传统的单体应用中，通常通过传统的“打日志”的方式去实现最初级的可观测性需求，我们通常只是在代码里提供一些日志输出，比如 `log.Printf()`一下，然后就能在应用的控制台看见日志输出。再高级点，可能就是分为`[Warn]` `[Info]` `[Error]` `[Fatal]`之类的日志输出，这样的简单监控对于单体应用排查问题基本也是够用的。

## Traces, metrics and logs
随着分布式、微服务复杂架构以及复杂业务逻辑的兴起，简单的“打日志”方式在已经不能满足对整个应用的可观测性需求，一个请求在微服务中可能会跨多个服务来处理，每个服务如果都是采用简单的日志输出打印到控制台上，这样的遥测数据很明显是非常杂乱低效的。于是在新时代下诞生了一套新的遥测方法，其中核心是链路追踪，一般称为trace，简单来说比如在微服务架构里追踪一个请求，这个请求每经过一个服务就产生一个span，每个span下还可以根据当前服务内的业务逻辑再带一串subspan，一串subspan组成了代表这个服务的span，而这一串span则组成了这个请求经过各个服务的最终整个trace数据。除了trace以外，这套新遥测数据还包括metric和log，metric是什么呢，就是直接的对应用内要观测的数值输出，比如网络延迟、运行时间等等，至于log就是之前讲的传统的事件日志输出。

## OpenTelemetry
这套trace、metric和log的云原生时代下的新的可观测方式固然是非常有效的，但是新问题又来了。
对于trace、metric和log这套遥测数据的接收，通常是会采用专门的可观测性后端来接收（什么是可观测性后端呢，就是像 Jaeger、Prometheus这样的接受这套遥测数据进行处理并最终以仪表化的方式呈现出来的应用）。而问题在于不同的可观测后端有各自对遥测数据的标准，有各自的SDK，有的可观测性后端是以trace为核心设计的，有的又是以观测metric为主，最终导致应用侧需要为不同可观测性后端分别接入不同的 SDK 或 exporter，导致会被供应商锁定，以及重复埋点，迁移的成本高，此外还有就是trace、metric、和log根据不同供应商设计，导致之间关联语义不统一。

而OpenTelemetry就是为了“统一”这套标准而出现，实现了供应商无关。注意此处并不意味着强制所有可观测性后端都必须采用 OpenTelemetry 自己的一套存储模型或内部实现，OpenTelemetry 更像是一层位于应用与可观测性后端之间的标准化抽象层。实际上，OpenTelemetry是通过一套中间层colletor在应用和可观测性后端之间实现遥测数据解耦，并提供了统一的SDK和遥测数据协议OTLP，开发者通过SDK开发应用的遥测数据输出，这套数据经过collector后就能实现对接各个可观测性后端，也就是供应商无关。

而OpenTelemetry Collector 作为中间层负责：

- 接收遥测数据
- 数据处理与转换
- batch、filter类似的 pipeline 操作
- 将数据导出到不同的可观测性后端

这里不对Collector展开，总体内部是有一套比较复杂的处理方式，同时Collector也是OpenTelemetry最核心的部分。

## Agent
另外随着ai agent的兴起，为了实现对agent的可观测性，OpenTelemetry的可观测性愿景被发现在agent领域也是非常合适，trace对于agent的行为链路追踪是非常合适的，metric可以用做显示对应的token消耗，能看到有非常多agent相关的项目正在集成OpenTelemetry。




