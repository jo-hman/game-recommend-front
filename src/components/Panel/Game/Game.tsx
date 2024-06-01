'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

import type { Comment, GameBundle } from '../../../types';

import { GameStyled } from './Game.styles';
import { config } from '../../../config/config';
import { useSession } from '../../../hooks/use-session';
import { fetchScore } from '../../../fetching/fetch-score';
import { fetchComments } from '../../../fetching/fetch-comments';
import { apiBaseUrl } from '../../../utils/api';

const { hostname } = config;

type PanelProps = {
  gameBundle: GameBundle;
};

const Game: React.FC<PanelProps> = ({ gameBundle }) => {
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState<string>('');
  const ref = useRef<HTMLFormElement>(null);

  const { authorAccountId, id, title, description } = gameBundle;

  const { session } = useSession();

  const handleSubmit = useCallback(async () => {
    if (session) {
      if (!comment) {
        return null;
      }

      await axios.post(
        `${apiBaseUrl}/games/${id}/comments`,
        { comment },
        {
          headers: { Authorization: `Bearer ${session.jwt}` },
        }
      );

      clearComment();

      fetchComments(id, session.jwt).then((comments) => {
        setComments(comments);
      });
    }
  }, [session, comment, id]);

  useEffect(() => {
    if (session) {
      fetchComments(id, session.jwt).then((comments) => {
        setComments(comments);
      });

      fetchScore(id, session.jwt).then(({ average, count }) => {
        setAverage(average);
        setCount(count);
      });
    }
  }, [session, id]);

  useEffect(() => {
    const handleKeyboardInput = (event: KeyboardEvent) => {
      if (
        ref.current &&
        ref.current.contains(event.target as Node) &&
        event.code === 'Enter'
      ) {
        handleSubmit();
      }
    };

    document.addEventListener('keydown', handleKeyboardInput);

    return () => {
      document.removeEventListener('keydown', handleKeyboardInput);
    };
  }, [handleSubmit]);

  const handleScore = async (scoreValue: number) => {
    await axios.post(
      `${apiBaseUrl}/games/${id}/scores`,
      { score: scoreValue },
      {
        headers: { Authorization: `Bearer ${session.jwt}` },
      }
    );

    fetchScore(id, session.jwt).then(({ average, count }) => {
      setAverage(average);
      setCount(count);
    });
  };

  const handleCommentChange = (event) => setComment(event.target.value);
  const clearComment = () => setComment('');

  const commentClear = comment ? (
    <p className="clear" onClick={clearComment}>
      &#10005;
    </p>
  ) : null;

  const commentsComponent = comments.length !== 0 && (
    <div className="comments">
      <p className="comments-header">COMMENTS:</p>
      {comments.map(({ comment: value, author }, index) => {
        return (
          <div key={index} className="comment">
            <p>Author: {author}</p>
            <p>{value}</p>
          </div>
        );
      })}
    </div>
  );

  return (
    <GameStyled>
      <p>Title: {title}</p>
      <p>Description: {description}</p>
      <p>
        Score: {average} Count: {count}
      </p>
      <p>Added by: {authorAccountId}</p>
      <div className="scores">
        <button
          type="button"
          onClick={() => handleScore(1)}
          className="score-button"
        >
          <p>1</p>
        </button>
        <button
          type="button"
          onClick={() => handleScore(2)}
          className="score-button"
        >
          <p>2</p>
        </button>
        <button
          type="button"
          onClick={() => handleScore(3)}
          className="score-button"
        >
          <p>3</p>
        </button>
        <button
          type="button"
          onClick={() => handleScore(4)}
          className="score-button"
        >
          <p>4</p>
        </button>
        <button
          type="button"
          onClick={() => handleScore(5)}
          className="score-button"
        >
          <p>5</p>
        </button>
      </div>
      <form ref={ref}>
        <p className="label">Comment</p>
        <div className="input-frame">
          <input
            type="text"
            className="form-input"
            onChange={handleCommentChange}
            value={comment}
          />
          {commentClear}
        </div>
      </form>
      <button type="button" onClick={handleSubmit} className="submit-button">
        Post comment
      </button>
      {commentsComponent}
    </GameStyled>
  );
};

export { Game };
