
-- Function to get all categories
CREATE OR REPLACE FUNCTION public.get_all_categories()
RETURNS SETOF public.categories AS $$
  SELECT * FROM public.categories ORDER BY name;
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to get category by ID
CREATE OR REPLACE FUNCTION public.get_category_by_id(category_id UUID)
RETURNS SETOF public.categories AS $$
  SELECT * FROM public.categories WHERE id = category_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to create a category
CREATE OR REPLACE FUNCTION public.create_category(
  category_name TEXT,
  category_slug TEXT
)
RETURNS public.categories AS $$
DECLARE
  new_category public.categories;
BEGIN
  INSERT INTO public.categories (name, slug)
  VALUES (category_name, category_slug)
  RETURNING * INTO new_category;
  
  RETURN new_category;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update a category
CREATE OR REPLACE FUNCTION public.update_category(
  category_id UUID,
  category_name TEXT,
  category_slug TEXT
)
RETURNS public.categories AS $$
DECLARE
  updated_category public.categories;
BEGIN
  UPDATE public.categories
  SET 
    name = COALESCE(category_name, name),
    slug = COALESCE(category_slug, slug)
  WHERE id = category_id
  RETURNING * INTO updated_category;
  
  RETURN updated_category;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete a category
CREATE OR REPLACE FUNCTION public.delete_category(category_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM public.categories WHERE id = category_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
