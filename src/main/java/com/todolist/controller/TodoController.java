package com.todolist.controller;

import com.todolist.dto.TodoDTO;
import com.todolist.entity.Todo;
import com.todolist.repository.TodoRepository;
import com.todolist.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/todos")
public class TodoController {

    private final TodoRepository todoRepository;

    public TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @GetMapping
    public List<Todo> getTodos() {
        return todoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Todo getTodo(@PathVariable Long id) {
        return todoRepository.findById(id).orElseThrow(RuntimeException::new);
    }

    @PostMapping
    public ResponseEntity createTodo(@RequestBody Todo todo) throws URISyntaxException {
        Todo savedTodo = todoRepository.save(todo);
        return ResponseEntity.created(new URI("/todos/" + savedTodo.getId())).body(savedTodo);
    }

    @PutMapping("/{id}")
    public ResponseEntity updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        Todo currentTodo = todoRepository.findById(id).orElseThrow(RuntimeException::new);
        currentTodo.setTask(todo.getTask());
        currentTodo.setCompleted(todo.isCompleted());
        currentTodo = todoRepository.save(currentTodo);

        return ResponseEntity.ok(currentTodo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteTodo(@PathVariable Long id) {
        todoRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}