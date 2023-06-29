package com.todolist.dto;

import lombok.Data;

@Data
public class TodoDTO {
    private Long id;
    private String task;
    private boolean completed;
}