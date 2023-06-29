package com.todolist.service;

import com.todolist.dto.TodoDTO;
import com.todolist.entity.Todo;
import com.todolist.repository.TodoRepository;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<TodoDTO> getTodos() {
        List<Todo> todos = todoRepository.findAll();
        return todos.stream()
                .map(todo -> modelMapper.map(todo, TodoDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public TodoDTO getTodo(Long id) {
        Optional<Todo> todoOptional = todoRepository.findById(id);
        return todoOptional.map(todo -> modelMapper.map(todo, TodoDTO.class)).orElse(null);
    }

    @Override
    public TodoDTO createTodo(TodoDTO todoDTO) {
        Todo todo = modelMapper.map(todoDTO, Todo.class);
        todo.setCompleted(false);
        Todo savedTodo = todoRepository.save(todo);
        return modelMapper.map(savedTodo, TodoDTO.class);
    }

    @Override
    public TodoDTO updateTodo(Long id, TodoDTO todoDTO) {
        Optional<Todo> todoOptional = todoRepository.findById(id);
        if (todoOptional.isPresent()) {
            Todo todo = todoOptional.get();
            todo.setTask(todoDTO.getTask());
            Todo updatedTodo = todoRepository.save(todo);
            return modelMapper.map(updatedTodo, TodoDTO.class);
        }
        return null;
    }

    @Override
    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }
}