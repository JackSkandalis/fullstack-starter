package com.starter.fullstack.dao;

import com.starter.fullstack.api.Inventory;
import java.util.Optional;
import java.util.List;
import javax.annotation.Resource;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.utility.DockerImageName;

/**
 * Test Inventory DAO.
 */
@DataMongoTest
@RunWith(SpringRunner.class)
public class InventoryDAOTest {
  @ClassRule
  public static final MongoDBContainer mongoDBContainer = new MongoDBContainer(DockerImageName.parse("mongo:4.0.10"));

  @Resource
  private MongoTemplate mongoTemplate;
  private InventoryDAO inventoryDAO;
  private static final String NAME = "Amber";
  private static final String PRODUCT_TYPE = "hops";

  @Before
  public void setup() {
    this.inventoryDAO = new InventoryDAO(this.mongoTemplate);
  }

  @After
  public void tearDown() {
    this.mongoTemplate.dropCollection(Inventory.class);
  }

  /**
   * Test Find All method.
   */
  @Test
  public void findAll() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    this.mongoTemplate.save(inventory);
    List<Inventory> actualInventory = this.inventoryDAO.findAll();
    Assert.assertFalse(actualInventory.isEmpty());
  }

  @Test
  public void create() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    this.inventoryDAO.create(inventory);
    this.inventoryDAO.create(inventory);
    List<Inventory> actualInventory = this.inventoryDAO.findAll();
    Assert.assertTrue(actualInventory.size() == 2);
  }

  @Test
  public void delete() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    this.inventoryDAO.create(inventory);
    List<Inventory> actualInventory = this.inventoryDAO.findAll();

    this.inventoryDAO.delete(actualInventory.get(0).getId());
    actualInventory = this.inventoryDAO.findAll();
    Assert.assertTrue(actualInventory.size() == 0);
  }

  @Test
  public void update() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    this.inventoryDAO.create(inventory);

    Inventory inventory2 = new Inventory();
    inventory2.setName("Updated Name");
    inventory2.setProductType(PRODUCT_TYPE);

    List<Inventory> actualInventory = this.inventoryDAO.findAll();
    String id = actualInventory.get(0).getId();

    this.inventoryDAO.update(id, inventory2);
    
    actualInventory = this.inventoryDAO.findAll();
    Assert.assertTrue(actualInventory.get(0).getName().equals("Updated Name"));
  }

  @Test
  public void retrieve() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    this.inventoryDAO.create(inventory);

    Inventory inventory2 = new Inventory();
    inventory2.setName(NAME);
    inventory2.setProductType("ProductType 2");
    this.inventoryDAO.create(inventory2);
    List<Inventory> actualInventory = this.inventoryDAO.findAll();

    Optional<Inventory> retrieved = this.inventoryDAO.retrieve(actualInventory.get(1).getId());
    Assert.assertTrue(retrieved.isPresent());
    Assert.assertTrue(retrieved.get().getProductType().equals("ProductType 2"));
  }
}
