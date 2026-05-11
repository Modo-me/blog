---
title: Swift6之后更现代的REST API方法
published: 2026-03-12
tags: [Swift]
category: 技术总结
draft: false
---

目前网上检索到的关于Swift的REST API Call实现很多已经在swift6之后算是过时了的，Swift6强化了并发安全，以及URLsession API也相应增加了async版本（旧版本使用callback），更modern的方法是使用async/await以及Task来构建REST API Call

以下均使用URLsession进行REST API Call

在旧版Swift中, Get接口是这么call的

```swift
        func fetchPage(completion: @escaping (Result<PageData, Error>) -> Void) {

        let url = URL(string: "http://127.0.0.1:8080/community/page/get")!

        URLSession.shared.dataTask(with: url) { data, response, error in

            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(URLError(.badServerResponse)))
                return
            }

            do {
                let result = try JSONDecoder().decode(PageData.self, from: data)
                completion(.success(result))
            } catch {
                completion(.failure(error))
            }

        }.resume()
    }
```
大量使用了回调函数。
另外值得说的是在Swift6中xcode默认会给没有显式隔离的代码视作@MainActor,也就是默认跑主线程，所以在老式写法里对于*let result = try JSONDecoder().decode(PageData.self, from: data)*这里要在*PageData*的结构体上标注一个*nonisolated*

Swift6以后，新式Get Call 的async/await写法是这样的

```swift
    func fetchPage() async throws -> PageData {
        let url = URL(string: "http://127.0.0.1:8080/community/page/get")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode(PageData.self, from: data)
    }
```
wrap的时候可以通过Task来执行它
```swift
    func load() {
        Task{
            let newPageData = try await fetchPage()
            ···
            ······
            ·········
        }
    }
```

同样的这是Swift6之后现代版的Post Call
```swift
    func createTopic(title: String, content: String, time: Int64) async throws -> Topic {
        
        let newTopic = Topic(
            id: nil,
            title: title,
            content: content,
            create_time: time
        )
        
        guard let url = URL(string: "http://127.0.0.1:8080/community/page/addtopic") else {
            throw URLError(.badURL)
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        request.httpBody = try JSONEncoder().encode(newTopic)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              200..<300 ~= httpResponse.statusCode else {
            throw URLError(.badServerResponse)
        }
        
        return try JSONDecoder().decode(Topic.self, from: data)
    }
```
wrap之后用Task执行也是和get同理