

import cv2
import numpy as np

def circle_inversion(image_path, center_x, center_y, radius, output_path):
    # Load the image
    image = cv2.imread(image_path)

    # Get image dimensions
    height, width, _ = image.shape

    # Create a white canvas with the same size and number of channels as the original image
    #inverted_image = np.full((height, width, 3), 255, dtype=np.uint8)
    inverted_image=np.full((width, height, 3), 255, dtype=np.uint8)

    # Create an empty checklist
    checklist = []

    # Perform circle inversion
    for y in range(height):
        for x in range(width):
            # Calculate the distance from the current pixel to the center of the circle
            distance = (x - center_x) ** 2 + (y - center_y) ** 2

            # Calculate the coordinates of the inverted pixel
            if distance != 0:
                inv_x = int(center_x + (x - center_x) * (radius ** 2 / distance))
                inv_y = int(center_y + (y - center_y) * (radius ** 2 / distance))

                # Store the mapping in the checklist
                checklist.append(((x, y), (inv_x, inv_y), distance))

                # Ensure the inverted coordinates are within the image dimensions
                if 0 <= inv_x < height and 0 <= inv_y < width:
                    # Copy the color of the original pixel to the inverted pixel
                    inverted_image[inv_y, inv_x] = image[y, x]

    # Draw the circle of inversion on the inverted image
    #cv2.circle(inverted_image, (center_x, center_y), radius, (0, 0, 255), 2)

    # Save the inverted image
    cv2.imwrite(output_path, inverted_image)

    # Print the checklist
    print("Coordinate Mapping:")
    for original, inverted, distance in checklist:
        print(f"({original[0]}, {original[1]}) --> ({inverted[0]}, {inverted[1]})  Distance: {distance}")

# Example usage
image_path = "inversion_test.png"
output_path = "inverted_image.png"
center_x = 500  # x-coordinate of the center of the circle
center_y = 500  # y-coordinate of the center of the circle
radius = 250 # radius of the circle

circle_inversion(image_path, center_x, center_y, radius, output_path)
"""
import cv2
import numpy as np
import imageio

def circle_inversion(image_path, center_x, center_y, radius, output_path):
    # Load the image in RGB color space
    image = cv2.cvtColor(cv2.imread(image_path), cv2.COLOR_BGR2RGB)


    # Get image dimensions
    height, width, _ = image.shape


    # Create a white canvas with the same size and number of channels as the original image
    inverted_image = np.full((height, width, 3), 255, dtype=np.uint8)

    # Perform circle inversion
    for y in range(height):
        for x in range(width):
            # Calculate the distance from the current pixel to the center of the circle
            distance = ((x - center_x) ** 2 + (y - center_y) ** 2)

            # Calculate the coordinates of the inverted pixel
            if distance != 0 and not np.isnan(distance):
                inv_x = int((x - center_x) * (radius ** 2 / distance )+center_x )
                inv_y = int( (y - center_y) * (radius ** 2 / distance )+center_y )

                # Ensure the inverted coordinates are within the image dimensions
                if 0 <= inv_x < width and 0 <= inv_y < height:
                    # Copy the color of the original pixel to the inverted pixel
                    inverted_image[y, x] = image[inv_y, inv_x]

    return inverted_image

# Example usage
image_path = "inversion_test.jpg"
output_gif_path = "inversion_animation.gif"
center_y = 825  # y-coordinate of the center of the circle
radius = 200    # radius of the circle

# Define the range and step for x-coordinate of the center
start_x = 0
end_x = 1080
step_x = 20

frames = []
# Loop through different center positions and generate inverted images
for center_x in range(start_x, end_x + step_x, step_x):
    inverted_image = circle_inversion(image_path, center_x, center_y, radius, None)
    frames.append(inverted_image)

# Save the frames as a GIF
imageio.mimsave(output_gif_path, frames, duration=0.1)

print(f"GIF saved at: {output_gif_path}")
"""
