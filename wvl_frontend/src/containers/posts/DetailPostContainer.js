import React from "react";
import DetailPost from "../../components/posts/DetailPost";
import { useEffect, useState } from "react";
import { useContext } from "react";
import PostContext from "../../context/PostContext";
import client from "../../libs/api/_client";
import { useParams } from "react-router";
import { ToastsStore } from "react-toasts";

function DetailPostContainer() {
  const [loading, setLoading] = useState(false);
  const { postInfo, setPostInfo } = useContext(PostContext);
  const [commentForm, setCommentForm] = useState("");
  const DetailPostPageUrl = useParams();

  useEffect(() => {
    async function getData() {
      console.log(postInfo.post);
      try {
        const response = await client.get(
          `vaccine/posts/${DetailPostPageUrl.postid}`
        );
        console.log(DetailPostPageUrl.postid);
        if (response.status === 200) {
          setLoading(false);
          const result = response.data.data;
          setPostInfo({
            post: result,
          });
          console.log("ㅁㅁㄴㅇㅁㅇ", postInfo._id);
          console.log("(전체 게시물 조회) 홈페이지 업로드 완료");
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
    getData();
  }, [setPostInfo]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    //postInfo.post.comments.commentContent
    setCommentForm({
      comment: value,
    });
    //console.log(value);
  };

  const onClickComment = async () => {
    console.log(commentForm);
    const { comment } = commentForm;
    try {
      const response = await client.post(
        `vaccine/comments/${DetailPostPageUrl.postid}`,
        {
          content: comment,
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        ToastsStore.success("댓글 게시 완료");
        const result = response.data.data;
        // console.log(targetComments)
        // console.log(postInfo)
        const targetComments = result.comments;
        setPostInfo({
          ...postInfo,
          post: {
            ...postInfo.post,
            comments: targetComments,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DetailPost
      postInfo={postInfo}
      onChangeInput={onChangeInput}
      onClickComment={onClickComment}
    />
  );
}

export default DetailPostContainer;