package com.todolist.service;

import com.todolist.dto.TodoDTO;

import java.util.List;

public interface TodoService {
    List<TodoDTO> getTodos();

    TodoDTO getTodo(Long id);

    TodoDTO createTodo(TodoDTO todoDTO);

    TodoDTO updateTodo(Long id, TodoDTO todoDTO);

    void deleteTodo(Long id);
}