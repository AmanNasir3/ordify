import {  useState } from "react";
import styles from "../ServiceDetails.module.css";
import {
  Box,
  Button,
  Text,
  Image,
  Flex,
  IconButton,
  HStack,
  VStack,
  Separator,
} from "@chakra-ui/react";
import { Tabs } from "@chakra-ui/react";
import { Dialog } from "@chakra-ui/react";
import { RadioGroup } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import type { Service } from "../../types";

 


// RoomServiceDetails component


export const RoomServiceDetails = ({ service }: { service: Service }) => {
  interface MenuItem {
    id: string;
    name: string;
    regularPrice: number;
    largePrice: number;
    image?: string;
  }

  interface MenuCategory {
    id: string;
    name: string;
    items: MenuItem[];
  }

  interface CartItem {
    id: string;
    name: string;
    size: "Regular" | "Large";
    price: number;
    quantity: number;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<"Regular" | "Large">(
    "Regular",
  );
  const [cart, setCart] = useState<CartItem[]>([]);

  const menuData: MenuCategory[] = [
    {
      id: "soups",
      name: "THE SOUP OPERA",
      items: [
        {
          id: "s1",
          name: "Chicken Corn Soup",
          regularPrice: 385,
          largePrice: 570,
          image:
            "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop",
        },
        {
          id: "s2",
          name: "Cream of Mushroom Soup",
          regularPrice: 570,
          largePrice: 740,
          image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop",
        },
        {
          id: "s3",
          name: "Cream of Chicken Soup",
          regularPrice: 640,
          largePrice: 820,
          image:
            "https://images.unsplash.com/photo-1588566565463-180a5b2090d2?w=600&h=400&fit=crop",
        },
      ],
    },
    {
      id: "salads",
      name: "THE GREEN BAR",
      items: [
        {
          id: "sl1",
          name: "Russian Salad",
          regularPrice: 605,
          largePrice: 805,
          image:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
        },
        {
          id: "sl2",
          name: "Fresh Green Salad",
          regularPrice: 280,
          largePrice: 450,
          image:
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
        },
      ],
    },
    {
      id: "fastfood",
      name: "VERY FAST FOOD",
      items: [
        {
          id: "ff1",
          name: "Chicken Nuggets with Fries",
          regularPrice: 1020,
          largePrice: 1320,
          image:
            "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=400&fit=crop",
        },
        {
          id: "ff2",
          name: "Chicken Burger",
          regularPrice: 770,
          largePrice: 970,
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
        },
        {
          id: "ff3",
          name: "Beef Burger",
          regularPrice: 785,
          largePrice: 985,
          image:
            "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop",
        },
        {
          id: "ff4",
          name: "Club Sandwich",
          regularPrice: 690,
          largePrice: 890,
          image:
            "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop",
        },
      ],
    },
    {
      id: "chinese",
      name: "FROM CHINA WITH LOVE",
      items: [
        {
          id: "ch1",
          name: "Chicken Manchurian",
          regularPrice: 1090,
          largePrice: 1390,
          image:
            "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop",
        },
        {
          id: "ch2",
          name: "Chicken Chow Mein",
          regularPrice: 1040,
          largePrice: 1340,
          image:
            "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&h=400&fit=crop",
        },
        {
          id: "ch3",
          name: "Chicken Fried Rice",
          regularPrice: 910,
          largePrice: 1210,
          image:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop",
        },
      ],
    },
    {
      id: "desserts",
      name: "DESSERT LOUNGE",
      items: [
        {
          id: "d1",
          name: "Cream Caramel",
          regularPrice: 280,
          largePrice: 380,
          image:
            "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=400&fit=crop",
        },
        {
          id: "d2",
          name: "Choice of Ice Cream",
          regularPrice: 175,
          largePrice: 275,
          image:
            "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&h=400&fit=crop",
        },
        {
          id: "d3",
          name: "Chocolate Mousse",
          regularPrice: 305,
          largePrice: 405,
          image:
            "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=600&h=400&fit=crop",
        },
      ],
    },
    {
      id: "beverages",
      name: "HOT & COLD BEVERAGES",
      items: [
        {
          id: "b1",
          name: "Cold Coffee",
          regularPrice: 370,
          largePrice: 520,
          image:
            "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=600&h=400&fit=crop",
        },
        {
          id: "b2",
          name: "Fresh Juices",
          regularPrice: 400,
          largePrice: 550,
          image:
            "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=400&fit=crop",
        },
        {
          id: "b3",
          name: "Milkshake",
          regularPrice: 450,
          largePrice: 600,
          image:
            "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop",
        },
        {
          id: "b4",
          name: "Green Tea",
          regularPrice: 195,
          largePrice: 295,
          image:
            "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=400&fit=crop",
        },
      ],
    },
  ];

  const handleChooseOptions = (item: MenuItem) => {
    setSelectedItem(item);
    setSelectedSize("Regular");
    setIsModalOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    const price =
      selectedSize === "Regular"
        ? selectedItem.regularPrice
        : selectedItem.largePrice;
    const cartItemId = `${selectedItem.id}-${selectedSize}`;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === cartItemId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prevCart,
        {
          id: cartItemId,
          name: selectedItem.name,
          size: selectedSize,
          price,
          quantity: 1,
        },
      ];
    });

    setIsModalOpen(false);
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Box>
      <div className={styles.headerSection}>
        <img
          src={service.image}
          alt={service.name}
          className={styles.headerImg}
        />
        <h1 className={styles.title}>{service.name}</h1>
      </div>

      <Flex
        gap={6}
        p={6}
        maxW="1400px"
        mx="auto"
        flexDirection={{ base: "column", lg: "row" }}
      >
        {/* Left Side - Menu */}
        <Box flex="1" minW="0">
          <Tabs.Root variant="plain" defaultValue={menuData[0].id}>
            <Tabs.List flexWrap="wrap" gap={2} mb={6}>
              {menuData.map((category) => (
                <Tabs.Trigger
                  key={category.id}
                  value={category.id}
                  fontSize="sm"
                  fontWeight="600"
                  px={4}
                  py={2}
                  borderRadius="full"
                  _selected={{ bg: "blue.500", color: "white" }}
                >
                  {category.name}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Tabs.ContentGroup>
              {menuData.map((category) => (
                <Tabs.Content key={category.id} value={category.id} p={0}>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
                    gap={4}
                  >
                    {category.items.map((item) => (
                      <Box
                        key={item.id}
                        borderRadius="12px"
                        overflow="hidden"
                        boxShadow="md"
                        bg="white"
                        transition="all 0.3s"
                        cursor="pointer"
                        _hover={{
                          transform: "translateY(-4px)",
                          boxShadow: "lg",
                        }}
                      >
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            w="100%"
                            h="180px"
                            objectFit="cover"
                          />
                        )}
                        <Box p={4}>
                          <Text fontSize="lg" fontWeight="600" mb={3}>
                            {item.name}
                          </Text>
                          <Flex justify="space-between" align="center">
                            <Text fontSize="sm" color="gray.600">
                              Starting from{" "}
                              <Text as="span" fontWeight="700" color="gray.800">
                                PKR {item.regularPrice}
                              </Text>
                            </Text>
                            <Button
                              size="sm"
                              color={"black"}
                              onClick={() => handleChooseOptions(item)}
                            >
                              Choose options →
                            </Button>
                          </Flex>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Tabs.Content>
              ))}
            </Tabs.ContentGroup>
          </Tabs.Root>
        </Box>

        {/* Right Side - Your Order */}
        <Box
          w={{ base: "100%", lg: "350px" }}
          bg="white"
          borderRadius="12px"
          boxShadow="md"
          p={6}
          position={{ base: "relative", lg: "sticky" }}
          top={{ lg: "20px" }}
          h="fit-content"
        >
          <Text fontSize="xl" fontWeight="700" mb={4}>
            Your Order
          </Text>
          <Separator mb={4} />

          {cart.length === 0 ? (
            <Text fontSize="sm" color="gray.500" textAlign="center" py={8}>
              You haven't added anything to your order yet.
            </Text>
          ) : (
            <VStack gap={3} align="stretch" mb={4}>
              {cart.map((item) => (
                <Box
                  key={item.id}
                  p={3}
                  bg="gray.50"
                  borderRadius="8px"
                  position="relative"
                >
                  <IconButton
                    aria-label="Remove item"
                    size="xs"
                    position="absolute"
                    top={2}
                    right={2}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    <IoClose />
                  </IconButton>
                  <Text fontSize="sm" fontWeight="600" mb={1}>
                    {item.name}
                  </Text>
                  <Text fontSize="xs" color="gray.600" mb={2}>
                    Size: {item.size} | Qty: {item.quantity}
                  </Text>
                  <Text fontSize="sm" fontWeight="700">
                    PKR {item.price * item.quantity}
                  </Text>
                </Box>
              ))}
            </VStack>
          )}

          <Separator mb={4} />

          <Flex justify="space-between" mb={4}>
            <Text fontSize="lg" fontWeight="700">
              TOTAL
            </Text>
            <Text fontSize="lg" fontWeight="700" color="blue.600">
              PKR {calculateTotal().toLocaleString()}
            </Text>
          </Flex>

          <Button
            w="100%"
            colorScheme="blue"
            size="lg"
            disabled={cart.length === 0}
          >
            Continue
          </Button>
        </Box>
      </Flex>

      {/* Size Selection Modal */}
      <Dialog.Root
        open={isModalOpen}
        onOpenChange={(e) => setIsModalOpen(e.open)}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{selectedItem?.name}</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>
              <Text fontSize="sm" fontWeight="600" mb={3}>
                Select size:
              </Text>
              <RadioGroup.Root
                value={selectedSize}
                onValueChange={(e) =>
                  setSelectedSize(e.value as "Regular" | "Large")
                }
              >
                <VStack gap={3} align="stretch">
                  <Box
                    p={4}
                    border="2px"
                    borderColor={
                      selectedSize === "Regular" ? "blue.500" : "gray.200"
                    }
                    borderRadius="8px"
                    cursor="pointer"
                    onClick={() => setSelectedSize("Regular")}
                    transition="all 0.2s"
                  >
                    <HStack justify="space-between">
                      <HStack>
                        <RadioGroup.Item value="Regular" colorPalette="blue" />
                        <Text fontWeight="600">Regular</Text>
                      </HStack>
                      <Text fontWeight="700">
                        PKR {selectedItem?.regularPrice}
                      </Text>
                    </HStack>
                  </Box>

                  <Box
                    p={4}
                    border="2px"
                    borderColor={
                      selectedSize === "Large" ? "blue.500" : "gray.200"
                    }
                    borderRadius="8px"
                    cursor="pointer"
                    onClick={() => setSelectedSize("Large")}
                    transition="all 0.2s"
                  >
                    <HStack justify="space-between">
                      <HStack>
                        <RadioGroup.Item value="Large" colorPalette="blue" />
                        <Text fontWeight="600">Large</Text>
                      </HStack>
                      <Text fontWeight="700">
                        PKR {selectedItem?.largePrice}
                      </Text>
                    </HStack>
                  </Box>
                </VStack>
              </RadioGroup.Root>
            </Dialog.Body>

            <Dialog.Footer>
              <Button
                variant="ghost"
                mr={3}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleAddToCart}>
                Add to Order
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
};
