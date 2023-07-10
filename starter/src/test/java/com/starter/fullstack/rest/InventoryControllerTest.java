package com.starter.fullstack.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.starter.fullstack.api.Inventory;
import com.starter.fullstack.api.Product;
import com.starter.fullstack.dao.InventoryDAO;

import java.util.List;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@RunWith(SpringRunner.class)
public class InventoryControllerTest {
    
  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private MongoTemplate mongoTemplate;
  private InventoryDAO inventoryDAO;

  @Autowired
  private ObjectMapper objectMapper;

  private Inventory inventory;

    @Before
    public void setup() throws Throwable {
        this.inventory = new Inventory();
        this.inventory.setId("ID");
        this.inventory.setName("TEST");
        // Sets the Mongo ID for us
        this.inventoryDAO = new InventoryDAO(this.mongoTemplate);
        this.inventory = this.inventoryDAO.create(this.inventory);
    }

    @After
    public void teardown() {
        this.mongoTemplate.dropCollection(Inventory.class);
    }

    /**
     * Test findAll endpoint.
     * @throws Throwable see MockMvc
     */
    @Test
    public void findAll() throws Throwable {
        this.mockMvc.perform(get("/inventory")
        .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().json("[" + this.objectMapper.writeValueAsString(inventory) + "]"));
    }

    /**
     * Test create endpoint.
     * @throws Throwable see MockMvc
     */
    @Test
    public void create() throws Throwable {
        Inventory inventory2 = new Inventory();
        inventory2.setId("SOME ID");
        inventory2.setName("TEST INVENTORY");
        inventory2.setProductType("SOME TYPE");

        this.mockMvc.perform(post("/inventory")
            .contentType(MediaType.APPLICATION_JSON)
            .content(this.objectMapper.writeValueAsString(inventory2)))
            .andExpect(status().isOk());

        List<Inventory> allInventory = inventoryDAO.findAll();    
        Assert.assertEquals(2, allInventory.size());
    }
}
