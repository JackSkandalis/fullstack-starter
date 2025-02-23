package com.starter.fullstack.rest;

import com.starter.fullstack.api.Inventory;
import com.starter.fullstack.dao.InventoryDAO;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Inventory Controller.
 */
@RestController
@RequestMapping("/inventory")
public class InventoryController {
  private final InventoryDAO inventoryDAO;

  /**
   * Default Constructor.
   * @param inventoryDAO inventoryDAO.
   */
  public InventoryController(InventoryDAO inventoryDAO) {
    Assert.notNull(inventoryDAO, "Inventory DAO must not be null.");
    this.inventoryDAO = inventoryDAO;
  }

  /**
   * Find Inventories.
   * @return List of Product.
   */
  @GetMapping
  public List<Inventory> findInventories() {
    return this.inventoryDAO.findAll();
  }

  /**
   * Create Inventory
   * @param inventory Inventory
   * @return Created Inventory
   */
  @PostMapping
  public Inventory create(@Valid @RequestBody Inventory inventory) {
    return this.inventoryDAO.create(inventory);
  }

  /**
   * Delete Inventory
   * @param ids Ids
   * @return Deleted Inventory
   */
  @DeleteMapping
  public List<Inventory> delete(@RequestBody List<String> ids) {
    List<Inventory> deletedInventories = new ArrayList<>();

    for (String id : ids) {
      Optional<Inventory> deleted = this.inventoryDAO.delete(id);
      deleted.ifPresent(deletedInventories::add);
    }

    return deletedInventories;
  }
}

