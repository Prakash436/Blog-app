export default function Post() {
    return (
        <div className="post">
        <div className="image">
          <img src="https://uploads-ssl.webflow.com/5b105a0c66f2f636c7884a17/64063dbcad97bd421b437096_chatgpt-p-800.jpg"alt=""/>
        </div>
        <div className="texts">
          <h2>Chat gpt is good</h2>
          <div className="info">
            <a href="/" className="author">David</a>
            <time>2023-01-06 16:45</time>
          </div>
          <p className="summary">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        </div>
      </div>
    );
}