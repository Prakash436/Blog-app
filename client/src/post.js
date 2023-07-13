import {format} from "date-fns"

export default function Post({title,summary,cover,createdAt,author}) {
    return (
        <div className="post">
        <div className="image">
          <img src={'http://localhost:4000/'+cover}alt=""/>
        </div>
        <div className="texts">
          <h2>{title}</h2>
          <div className="info">
            <a href="/" className="author">{author.username}</a>
            <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
          </div>
          <p className="summary">{summary}</p>
        </div>
      </div>
    );
}