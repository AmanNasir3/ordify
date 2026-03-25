import { useEffect, useState } from "react";
import styles from "../ServiceDetails.module.css";
import layoutStyles from "../ServiceDetailsLayout.module.css";
import formStyles from "../ServiceDetailsForm.module.css";
import {
  Box,
  Button,
  Text,
  Image,
  Flex,
  IconButton,
  VStack,
  Separator,
} from "@chakra-ui/react";
import { IoClose, IoAdd, IoRemove } from "react-icons/io5";
import { createOrder } from "../../services/api/Instance";
import { toaster } from "../../components/ui/toaster";

interface ApiItem {
  id: number;
  name: string;
  description: string | null;
  image: string;
  item_id: number;
  price: string;
  is_custom_amount: boolean;
  custom_amount: string;
  charge_tax: boolean;
  is_pos: boolean;
}

interface ApiSubCategory {
  id: number;
  name: string;
  description: string;
  image: string;
  items: ApiItem[];
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  is_pos: boolean;
}

const VISIBLE_PILLS = 4;

export const RoomServiceDetails = ({
  service,
  category,
}: {
  service: ApiSubCategory[] | null;
  category: any;
}) => {
  const menuData: ApiSubCategory[] = service || [];

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showMorePills, setShowMorePills] = useState(false);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (menuData.length > 0 && !activeCategory) {
      setActiveCategory(menuData[0].id.toString());
    }
  }, [menuData]);

  const visibleCategories = menuData.slice(0, VISIBLE_PILLS);
  const hiddenCategories = menuData.slice(VISIBLE_PILLS);

  const handleScrollToSection = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`section-${categoryId}`);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const handleAddToCart = (item: ApiItem) => {
    const itemId = item.id.toString();
    const price = parseFloat(item.price);
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === itemId);
      if (existing) {
        return prevCart.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prevCart,
        { id: itemId, name: item.name, price, quantity: 1, is_pos: item.is_pos },
      ];
    });
  };

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const formData = {
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          amount: item.price,
          quantity: item.quantity,
          is_pos: item.is_pos,
        })),
        comments,
        sub_booking_id: JSON.parse(localStorage.getItem("session") || "{}")
          ?.user_details?.sub_booking_id,
        is_pos: cart[0]?.is_pos || false,
      };
      const response = await createOrder(formData);
      if (response.status === 200 || response.status === 201) {
        toaster.create({
          description: "Your order has been submitted successfully!",
          type: "success",
        });
        setCart([]);
        setComments("");
      } else {
        toaster.create({
          description: response.data?.message || "Failed to submit order. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toaster.create({
        description: "Failed to submit order. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecreaseQuantity = (itemId: string) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === itemId);
      if (existing && existing.quantity === 1) {
        return prevCart.filter((i) => i.id !== itemId);
      }
      return prevCart.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== itemId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className={styles.detailsPage}>
      <div className={styles.headerSection}>
        <img
          src={category?.image}
          alt={category?.name}
          className={styles.headerImg}
        />
        <h1 className={styles.title}>{category?.name}</h1>
      </div>

      {/* Pills Navigation */}
      <Box
        bg="white"
        px={{ base: 4, md: 8 }}
        py={4}
        boxShadow="sm"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Flex align="center" gap={2} overflow="hidden">
          {visibleCategories.map((subCat) => (
            <Button
              key={subCat.id}
              size="sm"
              borderRadius="full"
              px={4}
              flexShrink={0}
              fontWeight="600"
              fontSize="xs"
              style={
                activeCategory === subCat.id.toString()
                  ? {
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                    }
                  : {}
              }
              bg={activeCategory === subCat.id.toString() ? undefined : "gray.100"}
              color={activeCategory === subCat.id.toString() ? undefined : "gray.700"}
              onClick={() => handleScrollToSection(subCat.id.toString())}
              _hover={{ opacity: 0.85 }}
            >
              {subCat.name}
            </Button>
          ))}

          {hiddenCategories.length > 0 && (
            <>
              {showMorePills &&
                hiddenCategories.map((subCat) => (
                  <Button
                    key={subCat.id}
                    size="sm"
                    borderRadius="full"
                    px={4}
                    flexShrink={0}
                    fontWeight="600"
                    fontSize="xs"
                    style={
                      activeCategory === subCat.id.toString()
                        ? {
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                          }
                        : {}
                    }
                    bg={
                      activeCategory === subCat.id.toString() ? undefined : "gray.100"
                    }
                    color={
                      activeCategory === subCat.id.toString() ? undefined : "gray.700"
                    }
                    onClick={() => handleScrollToSection(subCat.id.toString())}
                    _hover={{ opacity: 0.85 }}
                  >
                    {subCat.name}
                  </Button>
                ))}
              <Button
                size="sm"
                borderRadius="full"
                px={4}
                flexShrink={0}
                fontWeight="600"
                fontSize="xs"
                variant="outline"
                style={{ borderColor: "#667eea", color: "#667eea" }}
                onClick={() => setShowMorePills(!showMorePills)}
              >
                {showMorePills
                  ? "Show Less"
                  : `+${hiddenCategories.length} More`}
              </Button>
            </>
          )}
        </Flex>
      </Box>

      {/* Main Content */}
      <div className={layoutStyles.detailsLayout}>
        {/* All subcategories with items */}
        <Box flex="1" minW="0">
          {menuData.map((subCat) => (
            <Box
              key={subCat.id}
              id={`section-${subCat.id}`}
              mb={10}
              style={{ scrollMarginTop: "120px" }}
            >
              <Box
                mb={5}
                pb={3}
                borderBottom="2px solid"
                borderColor="gray.100"
                display="flex"
                alignItems="center"
                gap={3}
              >
                <Box
                  w="4px"
                  h="24px"
                  borderRadius="full"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                />
                <Text fontSize="lg" fontWeight="700" color="gray.800">
                  {subCat.name}
                </Text>
              </Box>

              <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(240px, 1fr))"
                gap={4}
              >
                {subCat.items.map((item) => {
                  const itemId = item.id.toString();
                  const cartItem = cart.find((i) => i.id === itemId);
                  return (
                    <Box
                      key={item.id}
                      borderRadius="12px"
                      overflow="hidden"
                      boxShadow="sm"
                      bg="white"
                      transition="all 0.3s"
                      _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
                      border="1px solid"
                      borderColor="gray.100"
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          w="100%"
                          h="160px"
                          objectFit="cover"
                        />
                      )}
                      <Box p={4}>
                        <Text fontSize="sm" fontWeight="700" mb={1} color="gray.800">
                          {item.name}
                        </Text>
                        {item.description && (
                          <Text fontSize="xs" color="gray.500" mb={1}>
                            {item.description}
                          </Text>
                        )}
                        <Text fontSize="xs" color="gray.500" mb={3}>
                          <Text as="span" fontWeight="700" color="gray.700">
                            PKR {parseFloat(item.price).toLocaleString()}
                          </Text>
                        </Text>

                        {cartItem ? (
                          <Flex
                            align="center"
                            justify="space-between"
                            bg="purple.50"
                            borderRadius="8px"
                            p={1}
                          >
                            <IconButton
                              aria-label="Decrease"
                              size="xs"
                              variant="ghost"
                              colorPalette="purple"
                              onClick={() => handleDecreaseQuantity(itemId)}
                            >
                              <IoRemove />
                            </IconButton>
                            <Text fontWeight="700" fontSize="sm" color="purple.700">
                              {cartItem.quantity}
                            </Text>
                            <IconButton
                              aria-label="Increase"
                              size="xs"
                              variant="ghost"
                              colorPalette="purple"
                              onClick={() => handleAddToCart(item)}
                            >
                              <IoAdd />
                            </IconButton>
                          </Flex>
                        ) : (
                          <Button
                            w="100%"
                            size="sm"
                            borderRadius="8px"
                            fontWeight="600"
                            style={{
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "white",
                            }}
                            onClick={() => handleAddToCart(item)}
                            _hover={{ opacity: 0.9 }}
                          >
                            Add to Cart
                          </Button>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Right Panel - Order Summary */}
        <aside className={layoutStyles.rightPanel}>
          <Box
            bg="white"
            borderRadius="16px"
            boxShadow="0 4px 16px rgba(30,30,47,0.08)"
            p={6}
            border="1px solid rgba(102, 126, 234, 0.1)"
            position="sticky"
            top="80px"
          >
            <Text fontSize="xl" fontWeight="700" mb={4} color="gray.800">
              Your Order
            </Text>
            <Separator mb={4} />

            {cart.length === 0 ? (
              <Text
                fontSize="sm"
                color="gray.400"
                textAlign="center"
                py={10}
                lineHeight="1.6"
              >
                You haven't added anything to your order yet.
              </Text>
            ) : (
              <VStack gap={3} align="stretch" mb={4}>
                {cart.map((item) => (
                  <Box
                    key={item.id}
                    p={3}
                    bg="gray.50"
                    borderRadius="10px"
                    position="relative"
                    border="1px solid"
                    borderColor="#764ba2"
                  >
                    <IconButton
                      aria-label="Remove item"
                      size="xs"
                      position="absolute"
                      top={2}
                      right={2}
                      variant="ghost"
                      colorPalette="red"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <IoClose />
                    </IconButton>
                    <Text fontSize="sm" fontWeight="600" mb={1} color="gray.800" pr={6}>
                      {item.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mb={2}>
                      Qty: {item.quantity}
                    </Text>
                    <Text fontSize="sm" fontWeight="700" color="purple.600">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </Text>
                  </Box>
                ))}
              </VStack>
            )}

            <Separator mb={4} />

            <Flex justify="space-between" mb={4}>
              <Text fontSize="md" fontWeight="700" color="gray.800">
                TOTAL
              </Text>
              <Text
                fontSize="md"
                fontWeight="700"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                PKR {calculateTotal().toLocaleString()}
              </Text>
            </Flex>

            <div className={formStyles.formGroup}>
              <label htmlFor="rs-comments" className={formStyles.label}>
                Comments
              </label>
              <textarea
                id="rs-comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className={formStyles.input + " " + formStyles.textarea}
                placeholder="Add any special requests..."
              />
            </div>

            <Button
              w="100%"
              size="lg"
              borderRadius="10px"
              fontWeight="700"
              disabled={cart.length === 0 || loading}
              loading={loading}
              onClick={handleSubmit}
              style={
                cart.length > 0
                  ? {
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                    }
                  : {}
              }
            >
              {loading ? "Submitting..." : "Continue"}
            </Button>
          </Box>
        </aside>
      </div>
    </div>
  );
};
