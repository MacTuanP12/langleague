package com.langleague.app.service.dto;

import java.io.Serializable;

public class CheckAnswerDTO implements Serializable {

    private Long questionId;
    private String studentAnswer;

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getStudentAnswer() {
        return studentAnswer;
    }

    public void setStudentAnswer(String studentAnswer) {
        this.studentAnswer = studentAnswer;
    }
}
