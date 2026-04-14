import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import LikesSelected from "@/assets/icons/LikesSelected.svg";
import Likes from "@/assets/icons/Likes.svg";
import DislikedSelected from "@/assets/icons/DislikedSelected.svg";
import Disliked from "@/assets/icons/Disliked.svg";
import { FeedbackType } from "@/types";
import FeedbackModal from "../FeedbackModal";
import { userTag } from "@/api";

const ICON_SIZE = 20;

const LikeBtn: React.FC<{
  liked: boolean;
  onPress: () => void;
}> = ({ liked, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {liked ? (
        <LikesSelected width={ICON_SIZE} height={ICON_SIZE} />
      ) : (
        <Likes width={ICON_SIZE} height={ICON_SIZE} />
      )}
    </TouchableOpacity>
  );
};

const DislikeBtn: React.FC<{
  disliked: boolean;
  onPress: () => void;
}> = ({ disliked, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {disliked ? (
        <DislikedSelected width={ICON_SIZE} height={ICON_SIZE} />
      ) : (
        <Disliked width={ICON_SIZE} height={ICON_SIZE} />
      )}
    </TouchableOpacity>
  );
};

const FeedbackButtons = ({ bubble, index, handleFeedback, handleLike }: any) => {
  const [liked, setLiked] = useState(bubble?.liked === FeedbackType.like);
  const [disliked, setDisliked] = useState(bubble?.liked === FeedbackType.dislike);
  useEffect(() => {
    setLiked(bubble?.liked === FeedbackType.like);
    setDisliked(bubble?.liked === FeedbackType.dislike);
  }, [bubble?.liked]);

  const [modalVisible, setModalVisible] = useState(false);
  const handleLikePress = async () => {
    try {
      // 提交反馈逻辑
      const params = {
        question_id: bubble.question_id,
        answer_id: bubble.answer_id,
        conversation_id: bubble?.conversation_id,
        tag_type: !liked ? FeedbackType.like : undefined,
      };
      await userTag(params);
      if (liked) {
        setLiked(false);
        await handleFeedback({ index, type: null });
      } else {
        setLiked(true);
        setDisliked(false);
        await handleFeedback({ index, type: FeedbackType.like });
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleDislikePress = async () => {
    try {
      if (disliked) {
        setDisliked(false);
        await handleFeedback({ index, type: null });
      } else {
        setModalVisible(true);
        // setDisliked(true);
        // setLiked(false);
        // await handleFeedback({ index, type: FeedbackType.dislike });
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleModalSubmit = async () => {
    try {
      setDisliked(true);
      setLiked(false);
      await handleFeedback({ index, type: FeedbackType.dislike });
      setModalVisible(false);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <LikeBtn liked={liked} onPress={handleLikePress} />
      <DislikeBtn disliked={disliked} onPress={handleDislikePress} />
      <FeedbackModal data={bubble} modalVisible={modalVisible} onSubmit={handleModalSubmit} closeModal={() => setModalVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    padding: 8,
  },
});

export default FeedbackButtons;